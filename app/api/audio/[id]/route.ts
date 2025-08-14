import { getAudio } from "@/lib/inMemoryStore";

export async function GET(_req: Request, context: any) {
	const id = context?.params?.id as string | undefined;
	if (!id) return new Response("Bad request", { status: 400 });
	const audio = getAudio(id);
	if (!audio) {
		return new Response("Not found", { status: 404 });
	}
	// Copy into a fresh Uint8Array-backed ArrayBuffer
	const u8 = new Uint8Array(audio.buffer.byteLength);
	u8.set(audio.buffer);
	return new Response(u8, {
		headers: {
			"Content-Type": audio.contentType,
			"Cache-Control": "public, max-age=600",
		},
	});
}


