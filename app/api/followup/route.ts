import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, getChatModel } from "@/lib/openaiClient";
import { Direction } from "@/lib/types";

interface FollowUpRequestBody {
  question: string;
  sentence: string;
  translation: string;
  userTranslation: string;
  explanation: string;
  direction: Direction;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FollowUpRequestBody;
    
    const sourceLang = body.direction === "es-to-en" ? "Spanish" : "English";
    const targetLang = body.direction === "es-to-en" ? "English" : "Spanish";
    
    const system = `You are a helpful language tutor. The user is learning ${targetLang} and has questions about their translation mistakes. 

    Be concise but thorough in explaining grammar, vocabulary, or translation concepts. Use examples when helpful.`;
    
    const user = `Context:
${sourceLang} sentence: "${body.sentence}"
Correct ${targetLang} translation: "${body.translation}"
User's translation: "${body.userTranslation}"
Previous feedback: "${body.explanation}"

User's question: ${body.question}

Please explain this clearly and helpfully.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: getChatModel(),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    
    return NextResponse.json({ response });
  } catch (err) {
    console.error("/api/followup error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
