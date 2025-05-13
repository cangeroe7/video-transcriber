// components/TranscriptEditor.tsx
"use client";

import { useEffect, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { MoreVertical } from "lucide-react";
import type { Subtitle, Subtitles } from "~/types";
import { ScrollArea } from "~/components/ui/scroll-area";

/* ---------- props ---------- */

type Props = {
	transcript: Subtitles;
	lowAccuracyThreshold?: number;
};

/* ---------- helpers ---------- */

const fmt = (s: number) => {
	const ms = Math.floor(s * 1000);
	return `${Math.floor(ms / 60000)}:${String(
		Math.floor((ms % 60000) / 1000),
	).padStart(
		2,
		"0",
	)}.${String(Math.floor((ms % 1000) / 10)).padStart(2, "0")}`;
};

/* ---------- component ---------- */

export default function TranscriptEditor({
	transcript,
	lowAccuracyThreshold = -1,
}: Props) {
	const [subs, setSubs] = useState<Subtitle[]>(transcript ?? []);
	const [showTimes, setShowTimes] = useState<boolean>(false); // per‑row

	useEffect(() => {
		if (transcript) setSubs(transcript);
	}, [transcript]);

	/* ---- helpers ---- */

	const mergeBelow = (idx: number) =>
		setSubs((prev) => {
			if (idx >= prev.length - 1) return prev;
			const cur = prev[idx]!;
			const next = prev[idx + 1]!;
			const merged: Subtitle = {
				...cur,
				end: next.end,
				text: `${cur.text} ${next.text}`.trim(),
			};
			return [...prev.slice(0, idx), merged, ...prev.slice(idx + 2)];
		});

	const addBelow = (idx: number) =>
		setSubs((prev) => {
			const cur = prev[idx]!;
			const nextId = Math.max(...prev.map((s) => s.id)) + 1;
			const blank: Subtitle = {
				...cur,
				id: nextId,
				start: cur.end,
				end: cur.end + 2,
				text: "",
				tokens: [],
				temperature: 0,
				avg_logprob: 0,
				compression_ratio: 0,
				no_speech_prob: 0,
				words: [],
			};
			return [...prev.slice(0, idx + 1), blank, ...prev.slice(idx + 1)];
		});

	const updateText = (idx: number, value: string) =>
		setSubs((prev) => {
			const clone = [...prev];
			clone[idx] = { ...clone[idx]!, text: value };
			return clone;
		});

	/* ---- render ---- */

	if (!subs.length) return null;

	return (
		<ScrollArea className="h-full w-full">
			<div className="w-full">
				{subs.map((sub, i) => {
					const lowAcc = sub.avg_logprob < lowAccuracyThreshold;

					return (
						<div key={sub.id}>
							<div className="flex w-full items-center gap-3 p-2">
								{/* subtitle text – flex‑1 so it shrinks when times column appears */}
								<div
									contentEditable
									suppressContentEditableWarning
									onChange={(e) =>
										updateText(
											sub.id,
											e.currentTarget.textContent || "",
										)
									}
									className={`flex-1 resize-none bg-transparent p-0 text-base leading-relaxed focus:outline-none ${
										lowAcc
											? "text-orange-500"
											: "text-foreground"
									}`}
									dangerouslySetInnerHTML={{
										__html: sub.text,
									}}
								></div>

								{/* times column (optional) */}
								{showTimes && (
									<div className="flex shrink-0 flex-col items-end text-xs text-muted-foreground">
										<span>{fmt(sub.start)}</span>
										<span>{fmt(sub.end)}</span>
									</div>
								)}

								{/* menu column – always fixed width */}
								<div className="flex w-8 shrink-0 items-center justify-center">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6"
												aria-label="Subtitle options"
											>
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent
											align="end"
											className="w-40"
										>
											<DropdownMenuItem
												onClick={() => {
													setShowTimes(
														(prev) => !prev,
													);
												}}
											>
												{showTimes
													? "Hide times"
													: "Show times"}
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => mergeBelow(i)}
											>
												Merge below
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => addBelow(i)}
											>
												Add new below
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>

							{/* divider */}
							{i !== subs.length - 1 && (
								<Separator className="my-2" />
							)}
						</div>
					);
				})}
			</div>
		</ScrollArea>
	);
}
