import { NextRequest, NextResponse } from "next/server";
import { ValidationRequestBody, ValidationResponseBody } from "@/lib/types";
import { getOpenAIClient, getChatModel } from "@/lib/openaiClient";

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as ValidationRequestBody;
		if (body.type === "transcription") {
			const isCorrect = normalize(body.userText) === normalize(body.expectedText);
			const res: ValidationResponseBody = { isCorrect };
			return NextResponse.json(res);
		}

		if (body.type === "translation") {
			const system = `You are a translation grader that provides nuanced feedback. Allow minor spelling mistakes and missing accents. 

			For responses, use JSON with keys:
			- isCorrect (boolean): true if meaning is correct (even if unnatural)
			- message (string): feedback message
			- correctedTranslation (string): more natural version if applicable
			- isNatural (boolean): true if translation sounds natural
			
			Grading criteria:
			1. If grammatically wrong or meaningless → isCorrect: false
			2. If correct meaning but unnatural → isCorrect: true, isNatural: false, provide more natural version
			3. If correct and natural → isCorrect: true, isNatural: true`;
			
			const user = `Source (${body.direction.startsWith("es") ? "Spanish" : "English"}): ${body.sourceText}\nUser Translation: ${body.userTranslation}\nExpected: ${body.expectedTranslation}\n\nEvaluate the user's translation considering minor spelling/accent mistakes are acceptable.`;
			const completion = await getOpenAIClient().chat.completions.create({
				model: getChatModel(),
				messages: [
					{ role: "system", content: system },
					{ role: "user", content: user },
				],
				temperature: 0,
				max_tokens: 300,
			});
			const raw = completion.choices[0]?.message?.content || "{}";
			let data: any;
			try {
				data = JSON.parse(raw);
			} catch {
				data = { isCorrect: false, message: "Invalid response", correctedTranslation: body.expectedTranslation, isNatural: false };
			}
			const res: ValidationResponseBody = {
				isCorrect: Boolean(data.isCorrect),
				message: data.message || undefined,
				correctedTranslation: data.correctedTranslation || body.expectedTranslation,
				isNatural: Boolean(data.isNatural),
			};
			return NextResponse.json(res);
		}

		return NextResponse.json({ error: "Invalid type" }, { status: 400 });
	} catch (err) {
		console.error("/api/validate error", err);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

function normalize(s: string): string {
	return s
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}+/gu, "")
		.replace(/[^\p{L}\p{N}]+/gu, " ")
		.trim();
}


