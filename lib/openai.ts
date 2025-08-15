import { Direction, DefinitionEntry } from "./types";
import { getOpenAIClient, getChatModel } from "./openaiClient";

function extractJson(text: string): any {
	try {
		return JSON.parse(text);
	} catch {
		const match = text.match(/\{[\s\S]*\}/);
		if (match) {
			return JSON.parse(match[0]);
		}
		throw new Error("Failed to parse JSON from model response");
	}
}

function removeDiacritics(input: string): string {
    return input
        .normalize("NFD")
        // @ts-ignore - Unicode property escapes supported in Node
        .replace(/\p{Diacritic}+/gu, "");
}

function buildNormalizedMap(original: string): { normalized: string; map: number[] } {
    const map: number[] = [];
    let normalized = "";
    for (let i = 0; i < original.length; i++) {
        const ch = original[i];
        const norm = removeDiacritics(ch);
        // norm can be multiple chars in theory; map each produced char back to original index
        for (let k = 0; k < norm.length; k++) {
            normalized += norm[k];
            map.push(i);
        }
    }
    return { normalized, map };
}

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findOccurrencesNormalized(text: string, term: string): { startIndex: number; endIndex: number }[] {
    const ranges: { startIndex: number; endIndex: number }[] = [];
    if (!term) return ranges;
    const { normalized, map } = buildNormalizedMap(text);
    const normLower = normalized.toLowerCase();
    const termNorm = removeDiacritics(term).toLowerCase();
    // Allow flexible whitespace in phrases
    const pattern = escapeRegex(termNorm).replace(/\s+/g, "\\s+");
    const re = new RegExp(pattern, "gu");
    let match: RegExpExecArray | null;
    while ((match = re.exec(normLower)) !== null) {
        const startNorm = match.index;
        const endNorm = startNorm + match[0].length; // exclusive
        const startIndex = map[startNorm] ?? 0;
        const endIndex = (map[endNorm - 1] ?? text.length - 1) + 1; // exclusive
        ranges.push({ startIndex, endIndex });
        if (re.lastIndex === match.index) re.lastIndex++; // avoid zero-length loops
    }
    return ranges;
}

function tokenizeWordSpans(text: string): { term: string; startIndex: number; endIndex: number }[] {
    const spans: { term: string; startIndex: number; endIndex: number }[] = [];
    // Unicode letters with optional apostrophe chunk (rare in es/en)
    const re = /\p{L}+(?:'\p{L}+)?/gu;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        spans.push({ term: m[0], startIndex: m.index, endIndex: m.index + m[0].length });
    }
    return spans;
}

function isRangeCovered(range: { startIndex: number; endIndex: number }, covered: { startIndex: number; endIndex: number }[]): boolean {
    return covered.some(c => range.startIndex >= c.startIndex && range.endIndex <= c.endIndex);
}

export async function ensureCoverageWithTranslations(
    text: string,
    translation: string,
    currentDefs: DefinitionEntry[],
    direction: Direction
): Promise<DefinitionEntry[]> {
    const covered = currentDefs.flatMap(d => d.occurrences);
    const tokens = tokenizeWordSpans(text);
    const missing = tokens.filter(t => !isRangeCovered({ startIndex: t.startIndex, endIndex: t.endIndex }, covered));

    // Deduplicate by term
    const uniqueTerms = Array.from(new Set(missing.map(m => m.term)));
    if (uniqueTerms.length === 0) return currentDefs;

    const targetLang = direction === "es-to-en" ? "English" : "Spanish";
    const sourceLang = direction === "es-to-en" ? "Spanish" : "English";
    const model = getChatModel();
    const user = `${sourceLang} sentence: "${text}"
${targetLang} translation: "${translation}"

For each token below, provide its contextual translation (1-3 words) as it appears in THIS sentence:
Tokens: ${JSON.stringify(uniqueTerms)}

Return ONLY JSON object mapping token → contextual translation. Example: {"manzana": "apple"}`;
    const system = `You provide contextual word translations within specific sentences. Translate based on how the word functions in that exact sentence context, not dictionary definitions.`;
    const completion = await getOpenAIClient().chat.completions.create({
        model,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
        temperature: 0,
        max_tokens: 400,
    });
    let mapping: Record<string, string> = {};
    try {
        mapping = JSON.parse(completion.choices[0]?.message?.content || "{}");
    } catch {
        mapping = {};
    }

    const added: DefinitionEntry[] = [];
    for (const term of uniqueTerms) {
        const def = mapping[term];
        if (!def) continue;
        added.push({
            term,
            definition: def,
            occurrences: findOccurrencesNormalized(text, term),
        });
    }
    return [...currentDefs, ...added];
}

export interface GeneratedSentenceRaw {
    text: string;
    translation: string;
    definitions: { term: string; definition: string; idiomatic?: boolean; groupType?: "idiom" | "pronoun-verb" }[];
}

export async function generateSentences(
	topic: string | undefined,
	grammarTopics: string[],
	direction: Direction
): Promise<GeneratedSentenceRaw[]> {
	const model = getChatModel();
	const sourceLang = direction === "es-to-en" ? "Spanish" : "English";
	const targetLang = direction === "es-to-en" ? "English" : "Spanish";
    const prompt = `You are a language learning content generator. Create exactly 1 ${sourceLang} sentence that ${topic ? `is about the topic: "${topic}" and ` : ""}MUST use these grammar topics: ${grammarTopics.join(", ")}. The sentence should be natural and A2-B1 level. Provide the correct ${targetLang} translation.

Also provide 6-10 contextual translations of important terms:
- Include single content words (verbs, nouns, adjectives, adverbs) as separate entries.
- Include multi-word expressions ONLY when they are idiomatic/non-compositional (e.g., "qué lo que"), OR when a pronoun+conjugated verb pair can reasonably be treated as a single translation (e.g., "Tú viajas" → "You travel").
- DO NOT group ordinary compositional phrases like "viajo mucho"; list those words separately.
- For each definition, provide the contextual translation as it appears in THAT sentence (e.g., "en" → "by" in "viaja en avión", not "in").
- For each entry, set either groupType="idiom" for idioms OR groupType="pronoun-verb" for pronoun+verb pairings. Otherwise omit groupType.
- Each definitions[i].term must be an exact substring copied from the sentence, matching spacing and punctuation.

Return ONLY valid JSON in this schema:
{
  "sentences": [
    {
      "text": "<sentence in ${sourceLang}>",
      "translation": "<${targetLang} translation>",
      "definitions": [
        { "term": "<exact substring from the sentence>", "definition": "<contextual translation in ${targetLang} as used in this sentence>", "groupType": "idiom"|"pronoun-verb" }
      ]
    }
  ]
}`;

	const completion = await getOpenAIClient().chat.completions.create({
		model,
		messages: [
			{
				role: "system",
				content:
					"You return concise JSON only, no commentary, no markdown. Keep definitions short and helpful.",
			},
			{ role: "user", content: prompt },
		],
		temperature: 0.7,
		max_tokens: 800,
		seed: Date.now(),
	});

	const raw = completion.choices[0]?.message?.content || "";
	const data = extractJson(raw);
	const items = (data.sentences as GeneratedSentenceRaw[]) || [];
	return items;
}

export function attachDefinitionOccurrences(
    text: string,
    definitions: { term: string; definition: string; idiomatic?: boolean; groupType?: "idiom" | "pronoun-verb" }[]
): DefinitionEntry[] {
    const stop = new Set([
        "el","la","los","las","de","a","que","y","o","en","con","por","para","un","una","uno","al","del","se","lo","le","les","me","te","su"
    ]);

    const results: DefinitionEntry[] = [];

    for (const d of definitions) {
        const isPhrase = /\s/.test(d.term.trim());
        const idiomatic = d.idiomatic === true || d.groupType === "idiom";
        const pronounVerb = d.groupType === "pronoun-verb";

        if (isPhrase && !(idiomatic || pronounVerb)) {
            // Skip non-idiomatic, non pronoun-verb multi-word groupings (e.g., "viajo mucho").
            continue;
        }

        let occ = findOccurrencesNormalized(text, d.term);
        if (occ.length === 0) {
            // Fallback: try key tokens if phrase didn't match
            const tokens = d.term.split(/\s+/).filter(t => t.length >= 3 && !stop.has(t.toLowerCase()));
            const tokenOcc: { startIndex: number; endIndex: number }[] = [];
            for (const t of tokens) {
                const matches = findOccurrencesNormalized(text, t);
                for (const m of matches) {
                    // avoid overlapping duplicates
                    if (!tokenOcc.some(x => !(m.endIndex <= x.startIndex || m.startIndex >= x.endIndex))) {
                        tokenOcc.push(m);
                    }
                }
            }
            occ = tokenOcc;
        }

        results.push({ term: d.term, definition: d.definition, occurrences: occ });
    }

    return results;
}


