import { NextRequest, NextResponse } from "next/server";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export async function GET(_req: NextRequest) {
	const key = process.env.AZURE_SPEECH_KEY;
	const region = process.env.AZURE_SPEECH_REGION;
	if (!key || !region) {
		return NextResponse.json({ error: "Azure speech env not configured" }, { status: 500 });
	}
	try {
		const fetchTokenUrl = `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
		const resp = await fetch(fetchTokenUrl, {
			method: "POST",
			headers: {
				"Ocp-Apim-Subscription-Key": key,
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
		if (!resp.ok) throw new Error(`Token request failed: ${resp.status}`);
		const token = await resp.text();
		return NextResponse.json({ token, region });
	} catch (err) {
		console.error("/api/stt/token error", err);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}


