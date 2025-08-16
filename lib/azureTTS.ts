import * as sdk from "microsoft-cognitiveservices-speech-sdk";

function getSpeechConfig(): sdk.SpeechConfig {
	const key = process.env.AZURE_SPEECH_KEY;
	const region = process.env.AZURE_SPEECH_REGION;
	if (!key || !region) {
		throw new Error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION env vars");
	}
	const config = sdk.SpeechConfig.fromSubscription(key, region);
	
	// 🎵 HIGH QUALITY: Use uncompressed PCM for best audio clarity
	config.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Riff48Khz16BitMonoPcm;
	
	// Alternative high-quality options (uncomment one):
	// config.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;  // MP3, good quality
	// config.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Ogg48Khz16BitMonoOpus;          // OGG, modern format
	
	// Optimize for clarity
	config.speechSynthesisLanguage = "es-CO";
	config.speechSynthesisSpeakingRate = 0.9;  // Slightly slower for clarity
	config.speechSynthesisPitch = 1.0;         // Natural pitch
	
	return config;
}

export async function synthesizeToBuffer(text: string, voiceName: string): Promise<{ buffer: Buffer; contentType: string }>{
	const speechConfig = getSpeechConfig();
	speechConfig.speechSynthesisVoiceName = voiceName;
	
	// Use SSML for better pronunciation control
	const ssmlText = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="es-ES">
		<voice name="${voiceName}">
			<prosody rate="0.9" pitch="+0%" volume="+20%">
				${text}
			</prosody>
		</voice>
	</speak>`;
	
	const stream = sdk.AudioOutputStream.createPullStream();
	const audioConfig = sdk.AudioConfig.fromStreamOutput(stream);
	const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

	return new Promise((resolve, reject) => {
		// Use SSML synthesis for better quality
		synthesizer.speakSsmlAsync(
			ssmlText,
			result => {
				try {
					synthesizer.close();
					if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
						const buffer = Buffer.from(result.audioData);
						// Update content type based on output format
						const contentType = speechConfig.speechSynthesisOutputFormat.toString().includes("Mp3") 
							? "audio/mpeg" 
							: "audio/wav";
						resolve({ buffer, contentType });
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
	// High-quality neural voices with clear pronunciation
	if (languageCode === "es") {
		// Spanish voices - choose the clearest ones
		//return "es-ES-ElviraNeural";        // Very clear, natural Spanish
		// Alternative options:
		// return "es-ES-AbrilNeural";       // Clear, professional
		// return "es-ES-DarioNeural";       // Clear male voice
		return "es-CO-SalomeNeural";      // Colombian accent, clear
		// return "es-MX-JorgeNeural";       // Mexican accent, clear
	}
	return "en-US-JennyNeural"; // High-quality English voice
}

// Additional high-quality voice options
export function getHighQualityVoices(): Record<string, string[]> {
	return {
		es: [
			"es-ES-ElviraNeural",      // Very clear, natural Spanish
			"es-ES-AbrilNeural",       // Clear, professional
			"es-ES-DarioNeural",       // Clear male voice
			"es-CO-SalomeNeural",      // Colombian accent, clear
			"es-MX-JorgeNeural",       // Mexican accent, clear
		],
		en: [
			"en-US-JennyNeural",       // Very clear, natural English
			"en-US-AriaNeural",        // Clear, professional
			"en-US-GuyNeural",         // Clear male voice
			"en-GB-SoniaNeural",       // British accent, clear
		]
	};
}

// Function to get voice with specific characteristics
export function getVoiceByCharacteristics(
	language: "es" | "en", 
	gender: "male" | "female" = "female",
	accent?: string
): string {
	const voices = getHighQualityVoices()[language] || [];
	
	if (accent) {
		// Try to find voice with specific accent
		const accentVoice = voices.find(v => v.includes(accent));
		if (accentVoice) return accentVoice;
	}
	
	// Return first available voice for the language
	return voices[0] || getDefaultVoiceForLanguage(language);
}