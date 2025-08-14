import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { SentenceBatchRequestBody, SentenceBatch, Direction } from "@/lib/types";
import { generateSentences, attachDefinitionOccurrences, ensureCoverageWithTranslations } from "@/lib/openai";
import { getDefaultVoiceForLanguage, synthesizeToBuffer } from "@/lib/azureTTS";
import { storeAudio } from "@/lib/inMemoryStore";

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as SentenceBatchRequestBody;
		const topic = body.topic?.trim() || undefined;
		const grammarTopics = Array.isArray(body.grammarTopics)
			? body.grammarTopics.map(g => String(g)).filter(Boolean)
			: [];
		if (grammarTopics.length === 0) {
			return NextResponse.json({ error: "grammarTopics required" }, { status: 400 });
		}

		const direction: Direction = body.direction || "es-to-en";
		const rawSentences = await generateSentences(topic, grammarTopics, direction);

		const needTts = direction === "es-to-en"; // TTS only for Spanish → English
		const voice = needTts ? getDefaultVoiceForLanguage("es") : undefined;
		let sentences = await Promise.all(
			rawSentences.map(async item => {
				let audioUrl: string | undefined;
				if (needTts && voice) {
					const { buffer, contentType } = await synthesizeToBuffer(item.text, voice);
					const audioId = storeAudio(buffer, contentType, 1000 * 60 * 10);
					audioUrl = `/api/audio/${audioId}`;
				}
				return {
					id: randomUUID(),
					text: item.text,
					translation: item.translation,
					audioUrl,
					definitions: attachDefinitionOccurrences(item.text, item.definitions),
				};
			})
		);

		// Ensure every word/expression is covered with a concise translation-only tooltip
		sentences = await Promise.all(
			sentences.map(async s => ({
				...s,
				definitions: await ensureCoverageWithTranslations(s.text, s.translation, s.definitions, direction),
			}))
		);

		const batch: SentenceBatch = {
			batchId: randomUUID(),
			direction,
			sentences,
		};

		return NextResponse.json(batch);
	} catch (err: any) {
		console.error("/api/sentence-batch error", err);
		const debugParam = req.nextUrl.searchParams.get("debug");
		const debug = process.env.NODE_ENV !== "production" || debugParam === "1";
		return NextResponse.json(
			{
				error: "Internal Server Error",
				message: debug ? String(err?.message || err) : undefined,
				stack: debug && err?.stack ? String(err.stack) : undefined,
			},
			{ status: 500 }
		);
	}
}


