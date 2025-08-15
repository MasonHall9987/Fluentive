export type Direction = "es-to-en" | "en-to-es";

export interface DefinitionOccurrence {
	startIndex: number;
	endIndex: number;
}

export interface DefinitionEntry {
	term: string;
	definition: string;
	occurrences: DefinitionOccurrence[];
}

export interface SentenceItem {
	id: string;
	text: string;
	translation: string;
	audioUrl?: string;
	definitions: DefinitionEntry[];
}

export interface SentenceBatch {
	batchId: string;
	direction: Direction;
	sentences: SentenceItem[];
}

export interface SentenceBatchRequestBody {
	topic?: string;
	grammarTopics: string[];
	direction?: Direction;
}

export type ValidationType = "transcription" | "translation";

export interface TranscriptionValidationBody {
	type: "transcription";
	expectedText: string;
	userText: string;
}

export interface TranslationValidationBody {
	type: "translation";
	sourceText: string;
	expectedTranslation: string;
	userTranslation: string;
	direction: Direction;
}

export type ValidationRequestBody =
	| TranscriptionValidationBody
	| TranslationValidationBody;

export interface ValidationResponseBody {
	isCorrect: boolean;
	message?: string;
	correctedTranslation?: string;
	isNatural?: boolean;
}


