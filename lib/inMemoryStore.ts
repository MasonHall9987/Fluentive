import { randomUUID } from "crypto";

export interface StoredAudio {
	buffer: Buffer;
	contentType: string;
	expiresAt?: number;
}

const audioStore = new Map<string, StoredAudio>();

export function storeAudio(buffer: Buffer, contentType: string, ttlMs?: number): string {
	const id = randomUUID();
	const expiresAt = typeof ttlMs === "number" ? Date.now() + ttlMs : undefined;
	audioStore.set(id, { buffer, contentType, expiresAt });
	return id;
}

export function getAudio(id: string): StoredAudio | undefined {
	const item = audioStore.get(id);
	if (!item) return undefined;
	if (item.expiresAt && item.expiresAt < Date.now()) {
		audioStore.delete(id);
		return undefined;
	}
	return item;
}

export function deleteAudio(id: string): void {
	audioStore.delete(id);
}

export function sweepExpired(): void {
	for (const [id, item] of audioStore.entries()) {
		if (item.expiresAt && item.expiresAt < Date.now()) {
			audioStore.delete(id);
		}
	}
}


