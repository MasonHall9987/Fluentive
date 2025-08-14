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
			const system =
				"You are a strict translation grader. Be concise. Respond JSON only with keys: isCorrect (boolean), message (string), correctedTranslation (string).";
			const user = `Source (${body.direction.startsWith("es") ? "Spanish" : "English"}): ${body.sourceText}\nUser Translation: ${body.userTranslation}\nExpected: ${body.expectedTranslation}\nGrade correctness and explain briefly if wrong.`;
			const completion = await getOpenAIClient().chat.completions.create({
				model: getChatModel(),
				messages: [
					{ role: "system", content: system },
					{ role: "user", content: user },
				],
				temperature: 0,
				max_tokens: 200,
			});
			const raw = completion.choices[0]?.message?.content || "{}";
			let data: any;
			try {
				data = JSON.parse(raw);
			} catch {
				data = { isCorrect: false, message: "Invalid response", correctedTranslation: body.expectedTranslation };
			}
			const res: ValidationResponseBody = {
				isCorrect: Boolean(data.isCorrect),
				message: data.message || undefined,
				correctedTranslation: data.correctedTranslation || body.expectedTranslation,
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


