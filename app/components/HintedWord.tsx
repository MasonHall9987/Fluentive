"use client";
import { ReactNode } from "react";

export default function HintedWord({ title, children }: { title: string; children: ReactNode }) {
	return (
		<span title={title} className="underline decoration-dotted cursor-help">
			{children}
		</span>
	);
}


