"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Clock, Trash2, MoreVertical, Plus, Loader2 } from "lucide-react";
import { Subtitle, Subtitles } from "~/types";
import { PlayerRef } from "@remotion/player";
import { DNA } from "react-loader-spinner";

interface SubtitleEditorProps {
	subtitlesState: Subtitles;
	setSubtitlesState: React.Dispatch<React.SetStateAction<Subtitles>>;
	currentSubtitle: number | null;
	setCurrentSubtitle: (id: number | null) => void;
	playerRef: React.RefObject<PlayerRef>;
	videoDuration: number;
	showLoading: boolean;
}

function formatTimeOneDecimal(time: number) {
	if (typeof time !== "number" || isNaN(time)) return "0.0";
	const minutes = Math.floor(time / 60);
	const seconds = (time % 60).toFixed(1);
	return `${minutes}:${seconds.padStart(4, "0")}`;
}

export default function SubtitleEditor({
	subtitlesState,
	setSubtitlesState,
	currentSubtitle,
	setCurrentSubtitle,
	playerRef,
	videoDuration,
	showLoading,
}: SubtitleEditorProps) {
	const [showTimings, setShowTimings] = useState(false);
	const editableRefs = useRef<{ [key: number]: HTMLSpanElement | null }>({});
	const cursorPositions = useRef<{ [key: number]: number }>({});
	const shouldRestoreCursor = useRef<number | null>(null);

	const saveCursorPosition = (id: number) => {
		const element = editableRefs.current[id];
		if (element) {
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				cursorPositions.current[id] = range.startOffset;
			}
		}
	};

	const restoreCursorPosition = (id: number) => {
		const element = editableRefs.current[id];
		const position = cursorPositions.current[id];

		if (element && position !== undefined) {
			const selection = window.getSelection();
			const range = document.createRange();

			// Make sure we don't exceed the text length
			const textNode = element.firstChild || element;
			const maxPosition = textNode.textContent?.length || 0;
			const safePosition = Math.min(position, maxPosition);

			try {
				if (textNode.nodeType === Node.TEXT_NODE) {
					range.setStart(textNode, safePosition);
					range.setEnd(textNode, safePosition);
				} else {
					range.setStart(element, 0);
					range.setEnd(element, 0);
				}

				selection?.removeAllRanges();
				selection?.addRange(range);
			} catch (error) {
				// Fallback: just focus the element
				element.focus();
			}
		}
	};

	useEffect(() => {
		if (shouldRestoreCursor.current) {
			restoreCursorPosition(shouldRestoreCursor.current);
			shouldRestoreCursor.current = null;
		}
	});

	const handleTextChange = (id: number, newText: string) => {
		saveCursorPosition(id);
		shouldRestoreCursor.current = id;
		setSubtitlesState((prev) =>
			prev!.map((line) =>
				line.id === id ? { ...line, text: newText } : line,
			),
		);
	};

	const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			// Move to next subtitle or create new one
			const currentIndex = subtitlesState!.findIndex(
				(line) => line.id === id,
			);
			if (currentIndex < subtitlesState!.length - 1) {
				const nextLine = subtitlesState![currentIndex + 1];
				if (nextLine) {
					editableRefs.current[nextLine.id]?.focus();
					setCurrentSubtitle(nextLine.id);
				}
			}
		} else if (e.key === "Escape") {
			(e.currentTarget as HTMLElement).blur();
		}
	};

	const addNewSubtitleLine = () => {
		// Find the next available numeric ID
		const nextId =
			subtitlesState && subtitlesState.length > 0
				? Math.max(
						...subtitlesState.map((line) =>
							typeof line.id === "number" ? line.id : 0,
						),
					) + 1
				: 1;

		// Default start/end times: append after the last subtitle, or start at 0
		let start = 0;
		let end = 0;
		if (subtitlesState && subtitlesState.length > 0) {
			const last = subtitlesState[subtitlesState.length - 1];
			start = typeof last?.end === "number" ? last.end : 0;
			// End is min(start+5, videoDuration)
			end = Math.min(start + 5, videoDuration);
		} else {
			end = Math.min(5, videoDuration);
		}

		const newLine: Subtitle = {
			id: nextId,
			seek: 0,
			start,
			end,
			text: "New Text",
			tokens: [],
			temperature: 0,
			avg_logprob: 0,
			compression_ratio: 0,
			no_speech_prob: 0,
			words: [],
		};
		setSubtitlesState((prev) => [...prev!, newLine]);
	};

	return (
		<div className="relative mx-auto flex h-full min-h-0 w-full flex-col bg-white shadow-sm">
			{/* Subtitle Lines */}
			<div
				className="relative min-h-0 flex-1 space-y-4 overflow-y-auto p-4"
				style={{
					scrollbarWidth: "thin",
				}}
			>
				{subtitlesState!.map((line) => (
					<div
						key={line.id}
						className="group relative pl-4"
						onClick={() => setCurrentSubtitle(line.id)}
					>
						{/* Left indicator div */}
						<div
							className={`absolute bottom-2 left-0 top-2 w-1 rounded-full transition-colors ${
								currentSubtitle === line.id
									? "bg-[#A76CFB]/50"
									: "bg-transparent group-hover:bg-gray-300"
							}`}
						/>
						<div className="flex min-h-[4rem] items-center justify-between">
							<div className="mr-4 flex min-h-[4rem] flex-1 items-center">
								<span
									ref={(el) => {
										editableRefs.current[line.id] = el;
									}}
									contentEditable
									suppressContentEditableWarning={true}
									className="block min-h-[1.5rem] w-full text-gray-900 outline-none"
									onInput={(e) => {
										const target =
											e.target as HTMLSpanElement;
										handleTextChange(
											line.id,
											target.textContent || "",
										);
									}}
									onKeyDown={(e) => handleKeyDown(e, line.id)}
									onFocus={() => setCurrentSubtitle(line.id)}
								>
									{line.text}
								</span>
							</div>

							<div className="flex items-center">
								{showTimings && (
									<div className="flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
										<div className="flex flex-row items-center gap-4">
											{/* Clocks column */}
											<div className="flex flex-col items-center gap-3">
												<Clock className="h-3 w-3" />
												<Clock className="h-3 w-3" />
											</div>
											{/* Labels column */}
											<div className="flex flex-col items-start gap-2">
												<span className="text-xs">
													In
												</span>
												<span className="text-xs">
													Out
												</span>
											</div>
											{/* Times column */}
											<div className="flex flex-col items-start gap-1">
												<span className="font-mono">
													{formatTimeOneDecimal(
														line.start,
													)}
												</span>
												<span className="font-mono">
													{formatTimeOneDecimal(
														line.end,
													)}
												</span>
											</div>
										</div>
									</div>
								)}

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="transition-opacity"
										>
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={() =>
												setShowTimings(!showTimings)
											}
										>
											<Clock className="mr-2 h-4 w-4" />
											{showTimings
												? "Hide Timings"
												: "Show Timings"}
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-red-600 focus:text-red-700"
											onClick={() => {
												setSubtitlesState((prev) =>
													prev!.filter(
														(subtitle) =>
															subtitle.id !==
															line.id,
													),
												);
												if (
													currentSubtitle === line.id
												) {
													setCurrentSubtitle(null);
												}
											}}
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</div>
				))}

				{/* Add New Subtitle Line Button */}
				<Button
					variant="ghost"
					onClick={addNewSubtitleLine}
					className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900"
				>
					<Plus className="mr-2 h-4 w-4" />
					Add New Subtitles Line 
				</Button>
				{showLoading && (
					<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
						<div className="flex flex-col items-center gap-4 rounded-lg bg-background px-8 py-10 shadow-xl">
							<DNA
								visible={true}
								height="80"
								width="80"
								ariaLabel="dna-loading"
								wrapperStyle={{}}
								wrapperClass="dna-wrapper"
							/>
							<p className="text-center text-sm text-muted-foreground">
								Transcription is being generated…
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
