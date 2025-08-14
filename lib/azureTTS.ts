import * as sdk from "microsoft-cognitiveservices-speech-sdk";

function getSpeechConfig(): sdk.SpeechConfig {
	const key = process.env.AZURE_SPEECH_KEY;
	const region = process.env.AZURE_SPEECH_REGION;
	if (!key || !region) {
		throw new Error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION env vars");
	}
	const config = sdk.SpeechConfig.fromSubscription(key, region);
	config.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
	return config;
}

export async function synthesizeToBuffer(text: string, voiceName: string): Promise<{ buffer: Buffer; contentType: string }>{
	const speechConfig = getSpeechConfig();
	speechConfig.speechSynthesisVoiceName = voiceName;
	const stream = sdk.AudioOutputStream.createPullStream();
	const audioConfig = sdk.AudioConfig.fromStreamOutput(stream);
	const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

	return new Promise((resolve, reject) => {
		synthesizer.speakTextAsync(
			text,
			result => {
				try {
					synthesizer.close();
					if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
						const buffer = Buffer.from(result.audioData);
						resolve({ buffer, contentType: "audio/mpeg" });
					} else {
						reject(new Error("TTS synthesis did not complete successfully"));
					}
				} catch (err) {
					reject(err);
				}
			},
			err => {
				synthesizer.close();
				reject(err);
			}
		);
	});
}

export function getDefaultVoiceForLanguage(languageCode: "es" | "en"): string {
	// Reasonable defaults; can be made configurable later.
	if (languageCode === "es") return "es-ES-AlvaroNeural";
	return "en-US-JennyNeural";
}


