"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import { PlayerRef } from "@remotion/player";
import {
	ChevronLeft,
	Scissors,
	Plus,
	SkipBack,
	Play,
	Pause,
	SkipForward,
	ZoomOut,
	ZoomIn,
} from "lucide-react";
import { Subtitles, Video } from "~/types";

export default function ControlsBar({
	subtitlesState,
  setSubtitlesState,
  video,
  currentSubtitle,
  setCurrentSubtitle,
  playerRef,
}: {
	subtitlesState: Subtitles;
	setSubtitlesState: React.Dispatch<React.SetStateAction<Subtitles>>;
  video: Exclude<Video, null>,
  currentSubtitle: number | null;
  setCurrentSubtitle: (id: number | null) => void;
  playerRef: React.RefObject<PlayerRef>;
}) {
	const [isPlaying, setIsPlaying] = useState(playerRef.current?.isPlaying());
	const [totalDuration] = useState(video.duration ?? 10);
	const [zoomLevel, setZoomLevel] = useState(100); // 0-100 slider value, start fully zoomed in
	const [isDragging, setIsDragging] = useState<{
		id: number;
		handle: "start" | "end";
	} | null>(null);
	const [isTimelineDragging, setIsTimelineDragging] = useState(false);
	const timelineRef = useRef<HTMLDivElement>(null);
	const [subtitleBarHeight, setSubtitleBarHeight] = useState(64); // default 16 (h-16) * 4px = 64px
	const [timelineDragTime, setTimelineDragTime] = useState<number | null>(null);
	const [currentTime, setCurrentTime] = useState(0);

	// For performance: use a ref to hold subtitles during drag
	const subtitlesRef = useRef(subtitlesState);
	// Keep ref in sync with state
	React.useEffect(() => {
		subtitlesRef.current = subtitlesState;
	}, [subtitlesState]);

	useEffect(() => {
		if (!playerRef.current) return;
		const handleFrameUpdate = (e: any) => {
			const frame = e.detail?.frame ?? playerRef.current?.getCurrentFrame?.() ?? 0;
			setCurrentTime(frame / 30);
		};
		playerRef.current.addEventListener("frameupdate", handleFrameUpdate);
		// Set initial time
		setCurrentTime((playerRef.current.getCurrentFrame?.() ?? 0) / 30);
		return () => {
			playerRef.current?.removeEventListener("frameupdate", handleFrameUpdate);
		};
	}, [playerRef]);

	// Generic functions that don't do anything
	const handlePlay = () => {
    playerRef.current?.toggle();
		setIsPlaying((prev) => !prev);
	};

	const handleSkipBack = () => {
    const frame = playerRef.current?.getCurrentFrame?.() ?? 0;
    const newFrame = Math.max(frame - 30 * 5, 0);
    playerRef.current?.seekTo(newFrame);
	};

	const handleSkipForward = () => {
    const frame = playerRef.current?.getCurrentFrame?.() ?? 0;
    const newFrame = Math.min(frame + 30 * 5, totalDuration * 30);
    playerRef.current?.seekTo(newFrame);
	};

	const handleSplit = () => {
		// Generic function
	};

	const handleAddSubtitle = () => {
		// Generic function
	};

	const handleFit = () => {
		setZoomLevel(100); // Reset to fully zoomed in
	};

	// Convert slider value to actual zoom multiplier
	const getZoomMultiplier = () => {
		// 0 = fully zoomed in (show min seconds), 100 = fully zoomed out (show full video)
		const minSeconds = 2; // minimum visible window in seconds
		if (zoomLevel === 100) {
			// Fully zoomed out: show the entire video
			return 1;
		} else {
			// 0 = minSeconds, 100 = totalDuration
			// Interpolate visible window size between minSeconds and totalDuration
			const visibleWindow =
				minSeconds + ((totalDuration - minSeconds) * zoomLevel) / 100;
			return totalDuration / visibleWindow;
		}
	};

	// Get visible duration based on zoom
	const getVisibleDuration = () => {
		if (zoomLevel === 100) return totalDuration;
		const minSeconds = 2;
		return minSeconds + ((totalDuration - minSeconds) * zoomLevel) / 100;
	};

	// Helper to get the visible window (start and end) based on zoom and currentTime
	const getVisibleWindow = () => {
		const visibleDuration = getVisibleDuration();
		let start = 0;
		let end = totalDuration;
		if (visibleDuration < totalDuration) {
			// Keep the same ratio of left/right as currentTime/totalDuration
			const ratio = currentTime / totalDuration;
			start = Math.max(0, currentTime - visibleDuration * ratio);
			end = Math.min(totalDuration, start + visibleDuration);
			// Adjust start if we're at the end
			if (end - start < visibleDuration) {
				start = Math.max(0, end - visibleDuration);
			}
		}
		return { start, end };
	};

	// Convert time to timeline position (percentage) accounting for zoom and visible window
	const timeToPosition = (time: number) => {
		const { start, end } = getVisibleWindow();
		if (time <= start) return 0;
		if (time >= end) return 100;
		return ((time - start) / (end - start)) * 100;
	};

	// Convert position to time
	const positionToTime = (position: number) => {
		const visibleDuration = getVisibleDuration();
		return (position / 100) * visibleDuration;
	};

	// Shared handler for starting a timeline drag (for both timeline and blue bar)
	const handleTimelineMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (!timelineRef.current) return;
			const rect = timelineRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const percentage = x / rect.width;
			const { start, end } = getVisibleWindow();
			const newTime = Math.max(
				start,
				Math.min(end, start + percentage * (end - start)),
			);
			setTimelineDragTime(newTime);
			playerRef.current?.seekTo(Math.round(newTime * 30));
			setIsTimelineDragging(true);
			// Add mousemove and mouseup listeners for dragging
			const handleMouseMove = (moveEvent: MouseEvent) => {
				if (!timelineRef.current) return;
				const moveRect = timelineRef.current.getBoundingClientRect();
				const moveX = moveEvent.clientX - moveRect.left;
				const movePercentage = moveX / moveRect.width;
				const { start, end } = getVisibleWindow();
				const moveTime = Math.max(
					start,
					Math.min(end, start + movePercentage * (end - start)),
				);
				setTimelineDragTime(moveTime);
				playerRef.current?.seekTo(Math.round(moveTime * 30));
			};
			const handleMouseUp = () => {
				setIsTimelineDragging(false);
				setTimelineDragTime(null);
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		},
		[getVisibleWindow, playerRef],
	);

	// Get time markers for current zoom level
	const getTimeMarkers = () => {
		// Show 6-7 markers for the visible window, which depends on zoom
		const markerCount = 6;
		const { start, end } = getVisibleWindow();
		const markers = [];
		for (let i = 0; i <= markerCount; i++) {
			const t = start + ((end - start) * i) / markerCount;
			markers.push(t);
		}
		return markers;
	};

	// Format time display
	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = (time % 60).toFixed(1);
		return `${minutes.toString().padStart(2, "0")}:${seconds.padStart(4, "0")}`;
	};

	// Format time markers
	const formatMarker = (time: number) => {
		if (time >= 60) {
			const minutes = Math.floor(time / 60);
			const seconds = time % 60;
			if (seconds === 0) return `${minutes}m`;
			// Show up to 2 significant digits for seconds
			const roundedSeconds = Number(seconds.toPrecision(2));
			return `${minutes}m${roundedSeconds}s`;
		}
		// Show up to 2 significant digits for seconds
		const rounded = Number(time.toPrecision(2));
		return `${rounded}s`;
	};

	// Helper to get previous and next subtitle for a given index
	const getPrevNext = (idx: number) => {
		return {
			prev: idx > 0 ? subtitlesState![idx - 1] : null,
			next:
				idx < subtitlesState!.length - 1
					? subtitlesState![idx + 1]
					: null,
		};
	};

	// Handle resizing
	const handleResizeMouseDown =
		(subtitleId: number, handle: "start" | "end") =>
		async (e: React.MouseEvent) => {
			e.stopPropagation();
			setIsDragging({ id: subtitleId, handle });
			const idx = subtitlesRef.current!.findIndex(
				(s) => s.id === subtitleId,
			);
			const { prev, next } = getPrevNext(idx);
			let draft = [...subtitlesRef.current!];
			const onMouseMove = (() => {
				let lastCall = 0;
				return async (moveEvent: MouseEvent) => {
					const now = Date.now();
					if (now - lastCall < 50) return;
					lastCall = now;
					if (!timelineRef.current) return;
					const rect = timelineRef.current.getBoundingClientRect();
					const x = moveEvent.clientX - rect.left;
					const { start, end } = getVisibleWindow();
					const percent = Math.max(0, Math.min(1, x / rect.width));
					const time = start + percent * (end - start);
					console.log("hello");
					draft = draft.map((s, i) => {
						if (s.id !== subtitleId) return s;
						if (handle === "start") {
							let newStart = Math.min(time, s.end);
							if (prev) newStart = Math.max(newStart, prev.end);
							return { ...s, start: Math.max(0, newStart) };
						} else {
							let newEnd = Math.max(time, s.start);
							if (next) newEnd = Math.min(newEnd, next.start);
							return {
								...s,
								end: Math.min(totalDuration, newEnd),
							};
						}
					});
					subtitlesRef.current = draft;
					setSubtitlesState(draft);
				};
			})();
			const onMouseUp = () => {
				setIsDragging(null);
				setSubtitlesState(draft); // Finalize state
				document.removeEventListener("mousemove", onMouseMove);
				document.removeEventListener("mouseup", onMouseUp);
			};
			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", onMouseUp);
		};

	return (
		<div className="mx-auto h-full w-full overflow-hidden border bg-gray-50">
			{/* Header Controls */}
			<div className="flex items-center justify-between border-b bg-white p-2">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" onClick={() => {}}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="sm" onClick={handleSplit}>
						<Scissors className="h-4 w-4" />
						Split
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleAddSubtitle}
					>
						<Plus className="h-4 w-4" />
						Add Subtitle
					</Button>
				</div>

				{/* Playback Controls */}
				<div className="flex items-center gap-1">
					<Button variant="ghost" size="sm" onClick={handleSkipBack}>
						<SkipBack className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="sm" onClick={handlePlay}>
						{isPlaying ? (
							<Pause className="h-4 w-4" />
						) : (
							<Play className="h-4 w-4" />
						)}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleSkipForward}
					>
						<SkipForward className="h-4 w-4" />
					</Button>
					<span className="font-mono text-sm">
						{formatTime(currentTime)} / {formatTime(totalDuration)}
					</span>
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						onMouseDown={() => {
							let interval: NodeJS.Timeout | null = null;
							const firstTimeout = setTimeout(() => {
								interval = setInterval(() => {
									setZoomLevel((prev) => {
										if (prev <= 0) {
											if (interval)
												clearInterval(interval);
											return 0;
										}
										return Math.max(0, prev - 1);
									});
								}, 60);
							}, 350); // Longer initial delay before repeat

							const clearAll = () => {
								clearTimeout(firstTimeout);
								if (interval) clearInterval(interval);
							};
							window.addEventListener("mouseup", clearAll, {
								once: true,
							});
							window.addEventListener("mouseleave", clearAll, {
								once: true,
							});
						}}
						onClick={() =>
							setZoomLevel((prev) => Math.max(0, prev - 1))
						}
					>
						<ZoomOut />
					</Button>
					<div className="w-20">
						<Slider
							max={100}
							min={0}
							step={1}
							value={[zoomLevel]}
							onValueChange={([val]) => setZoomLevel(val ?? 100)}
							className="w-full"
						/>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onMouseDown={() => {
							let interval: NodeJS.Timeout | null = null;
							const firstTimeout = setTimeout(() => {
								interval = setInterval(() => {
									setZoomLevel((prev) => {
										if (prev >= 100) {
											if (interval)
												clearInterval(interval);
											return 100;
										}
										return Math.min(100, prev + 1);
									});
								}, 60);
							}, 350); // Longer initial delay before repeat

							const clearAll = () => {
								clearTimeout(firstTimeout);
								if (interval) clearInterval(interval);
							};
							window.addEventListener("mouseup", clearAll, {
								once: true,
							});
							window.addEventListener("mouseleave", clearAll, {
								once: true,
							});
						}}
						onClick={() =>
							setZoomLevel((prev) => Math.min(100, prev + 1))
						}
					>
						<ZoomIn />
					</Button>
					<Button variant="ghost" size="sm" onClick={handleFit}>
						Fit
					</Button>
				</div>
			</div>

			{/* Timeline */}
			<div className="h-full px-2">
				<div className="relative h-full">
					{/* Time markers and dots in a single flex row, always 100% width, but time mapping is for visible window */}
					<div
						ref={timelineRef}
						className="flex h-8 w-full cursor-pointer select-none flex-row items-center justify-between"
						onMouseDown={handleTimelineMouseDown}
					>
						{getTimeMarkers().map((time, idx, arr) => {
							let dots = null;
							if (idx < arr.length - 1) {
								dots = [0, 1, 2].map((dotIdx) => (
									<div
										key={dotIdx}
										className="flex items-center justify-center"
									>
										<div className="h-1 w-1 rounded-full bg-gray-400"></div>
									</div>
								));
							}
							return (
								<React.Fragment key={time}>
									<div className="flex flex-col items-center">
										<span className="text-xs font-medium text-gray-600">
											{formatMarker(time)}
										</span>
									</div>
									{dots}
								</React.Fragment>
							);
						})}
					</div>
					{/* Divider between timeline and subtitles bar */}
					<div
						style={{
							position: "relative",
							left: "50%",
							right: "50%",
							width: "100vw",
							marginLeft: "-50vw",
							marginRight: "-50vw",
						}}
						className="h-px bg-gray-300"
					/>

					{/* Subtitle track - not draggable, height is dynamic */}
					<div
						className="absolute left-0 right-0"
						style={{
							top: `calc((100% - 20px - ${subtitleBarHeight}px) / 2)`,
							height: subtitleBarHeight,
						}}
					>
						<div className="relative h-full w-full rounded-lg border border-gray-300 bg-gradient-to-b from-gray-200 to-gray-300 shadow-inner">
							{/* Track lines for visual depth */}
							<div className="absolute inset-x-0 top-1/2 h-px bg-gray-400 opacity-50"></div>

							{subtitlesState!.map((subtitle, idx) => {
								const { start, end } = getVisibleWindow();
								// Only show if the subtitle overlaps the visible window
								if (
									subtitle.end < start ||
									subtitle.start > end
								)
									return null;
								// Clamp to visible window
								const barStart = Math.max(
									subtitle.start,
									start,
								);
								const barEnd = Math.min(subtitle.end, end);
								const leftPercent =
									((barStart - start) / (end - start)) * 100;
								const widthPercent =
									((barEnd - barStart) / (end - start)) * 100;
								return (
									<div
										key={subtitle.id}
										className={
											`absolute top-2 flex h-12 cursor-pointer select-none items-center rounded-lg text-sm font-medium text-white shadow-lg transition-all duration-200 ` +
											(currentSubtitle === subtitle.id
												? "z-30 border-2 border-[#5A06D1]"
												: "border border-[#A76CFB] hover:bg-[#A76CFB]")
										}
										style={{
											left: `${leftPercent}%`,
											width: `${widthPercent}%`,
											backgroundColor: "#A76CFB",
										}}
										onClick={() => {
											setCurrentSubtitle(subtitle.id);
											playerRef.current?.seekTo(Math.round(subtitle.start * 30));
										}}
									>
										{/* Left resize handle */}
										{/* Two vertical resize bars side by side at the left edge */}
										<div
											className="absolute left-0 top-0 z-20 flex h-full w-3 cursor-ew-resize flex-row items-center justify-center space-x-0.5"
											onMouseDown={handleResizeMouseDown(
												subtitle.id,
												"start",
											)}
										>
											<div
												className="h-4 w-0.5 rounded"
												style={{
													background:
														currentSubtitle ===
														subtitle.id
															? "#5A06D1"
															: "#A76CFB",
												}}
											/>
											<div
												className="h-4 w-0.5 rounded"
												style={{
													background:
														currentSubtitle ===
														subtitle.id
															? "#5A06D1"
															: "#A76CFB",
												}}
											/>
										</div>

										{/* Subtitle text */}
										<div className="flex-1 select-none px-2 text-center text-xs leading-tight break-words" style={{overflow: "hidden", textOverflow: "clip", whiteSpace: "normal", maxHeight: "2.5em"}}>
											{subtitle.text}
										</div>

										{/* Right resize handle */}
										{/* Two vertical resize bars side by side at the right edge */}
										<div
											className="absolute right-0 top-0 z-20 flex h-full w-3 cursor-ew-resize flex-row items-center justify-center space-x-0.5"
											onMouseDown={handleResizeMouseDown(
												subtitle.id,
												"end",
											)}
										>
											<div
												className="h-4 w-0.5 rounded"
												style={{
													background:
														currentSubtitle ===
														subtitle.id
															? "#5A06D1"
															: "#A76CFB",
												}}
											/>
											<div
												className="h-4 w-0.5 rounded"
												style={{
													background:
														currentSubtitle ===
														subtitle.id
															? "#5A06D1"
															: "#A76CFB",
												}}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Current time indicator - extends from top of timestamps to bottom of subtitle bar */}
					<div
						className="pointer-events-auto absolute z-30 w-0.5 bg-blue-600 shadow-lg"
						style={{
							left: `${timeToPosition(isTimelineDragging && timelineDragTime !== null ? timelineDragTime : currentTime)}%`,
							top: "0px",
							height: "calc(100% - 0px)",
						}}
						onMouseDown={handleTimelineMouseDown}
					>
						{/* Playhead triangle at the top */}
						<div
							className="absolute left-1/2 -translate-x-1/2"
							style={{
								width: 0,
								height: 0,
								borderLeft: "8px solid transparent",
								borderRight: "8px solid transparent",
								borderTop: "12px solid #2563eb", // blue-600
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
