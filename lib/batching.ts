import { Direction, SentenceBatch } from "./types";

export function nextDirection(current: Direction): Direction {
	return current === "es-to-en" ? "en-to-es" : "es-to-en";
}

export interface BatchState {
	current?: SentenceBatch;
	queued?: SentenceBatch;
	lastDirection: Direction;
}


