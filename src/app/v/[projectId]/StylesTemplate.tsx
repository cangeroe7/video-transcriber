"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { Settings, type Optional } from "~/types";
import { fontFamilies } from "~/components/ToolBar";

interface SubtitleProps {
	text: string;
	startTime: number;
	endTime: number;
	currentTime?: number;
	style: string;
	settings: Optional<
		Omit<Settings, "width" | "height" | "left" | "top">,
		"fontSize"
	>;
}

export const StylesTemplate: React.FC<SubtitleProps> = ({
	text,
	startTime,
	endTime,
	style,
	currentTime,
	settings,
}) => {
	const [activeWords, setActiveWords] = useState<Set<number>>(new Set());
	const [currentWordIndex, setCurrentWordIndex] = useState(-1);
	const [animationKey, setAnimationKey] = useState(0);
	const words = text.split(" ");
	const duration = endTime - startTime;
	const wordDuration = duration / words.length;

	useEffect(() => {
		if (typeof currentTime === "number") {
			// Seekable mode: set currentWordIndex based on currentTime
			const elapsed = currentTime - startTime;
			if (elapsed < 0) {
				setCurrentWordIndex(-1);
				setActiveWords(new Set());
			} else if (elapsed >= duration) {
				setCurrentWordIndex(words.length - 1);
				if (settings?.revertAfterActive) {
					setActiveWords(new Set());
				} else {
					setActiveWords(
						new Set(
							Array.from({ length: words.length }, (_, i) => i),
						),
					);
				}
			} else {
				const currentIndex = Math.floor(elapsed / wordDuration);
				setCurrentWordIndex(currentIndex);

				if (settings?.revertAfterActive) {
					setActiveWords(new Set([currentIndex]));
				} else {
					setActiveWords(
						new Set(
							Array.from(
								{ length: currentIndex + 1 },
								(_, i) => i,
							),
						),
					);
				}
			}
			return;
		}

		if (!settings?.animate) {
			setCurrentWordIndex(-1);
			setActiveWords(new Set());
			return;
		}

		const intervals: NodeJS.Timeout[] = [];

		words.forEach((_, index) => {
			// Activate word
			const activateTimeout = setTimeout(
				() => {
					setCurrentWordIndex(index);
					setActiveWords((prev) => new Set([...prev, index]));
				},
				index * wordDuration * 1000,
			);
			intervals.push(activateTimeout);

			// Deactivate word if revertAfterActive is enabled
			if (settings?.revertAfterActive) {
				const deactivateTimeout = setTimeout(
					() => {
						setActiveWords((prev) => {
							const newSet = new Set(prev);
							newSet.delete(index);
							return newSet;
						});
					},
					(index + 1) * wordDuration * 1000,
				);
				intervals.push(deactivateTimeout);
			}
		});

		// Reset after animation completes and restart the animation (loop)
		const resetTimeout = setTimeout(() => {
			setCurrentWordIndex(-1);
			setActiveWords(new Set());
			setTimeout(() => setAnimationKey((k) => k + 1), 1000);
		}, duration * 1000);
		intervals.push(resetTimeout);

		return () => {
			intervals.forEach(clearTimeout);
		};
	}, [
		settings?.animate,
		words.length || 0,
		wordDuration || 0,
		duration || 0,
		currentTime ?? null,
		startTime ?? null,
		animationKey,
		settings?.revertAfterActive,
	]);

	const getStyleClasses = (wordIndex: number, isVisible: boolean) => {
		const baseClasses = "transition-all duration-300 ease-in-out";
		const isCurrentlyActive = activeWords.has(wordIndex);
		const shouldShowActive = settings?.revertAfterActive
			? isCurrentlyActive
			: isVisible;

		// Apply settings if provided
		const fontSizeClass = settings?.fontSize
			? `text-[${settings.fontSize}px]`
			: "";
		const fontStyleClass = settings?.italic ? "italic" : "";
		const textColor = settings?.color ?? "";
		const animateOn = settings?.animate ?? false;

		switch (style) {
			case "current":
				return cn(
					baseClasses,
					"text-2xl",
					fontSizeClass,
					fontStyleClass,
					textColor,
					animateOn && !shouldShowActive
						? "opacity-30 scale-95"
						: "opacity-100 scale-100",
				);
			case "recent":
				return cn(
					baseClasses,
					"text-3xl text-black",
					fontSizeClass,
					fontStyleClass,
					textColor,
					animateOn && !shouldShowActive
						? "opacity-40 scale-100"
						: `opacity-100 scale-110 text-[${textColor}]`,
				);
			case "marketer":
				return cn(
					baseClasses,
					`text-3xl bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent`,
					"drop-shadow-lg",
					fontSizeClass,
					fontStyleClass,
					animateOn && !shouldShowActive
						? "opacity-50 scale-95"
						: "opacity-100 scale-100",
				);
			case "ali":
				return cn(
					baseClasses,
					`text-2xl text-[${textColor}]`,
					fontSizeClass,
					fontStyleClass,
					animateOn && !shouldShowActive
						? "opacity-60 scale-95"
						: "opacity-100 scale-100",
				);
			case "slay":
				return cn(
					baseClasses,
					"text-4xl text-white",
					"[-webkit-text-stroke:1px_black] [text-stroke:1px_black]",
					fontSizeClass,
					fontStyleClass,
					textColor,
					animateOn && !shouldShowActive
						? "opacity-50 scale-100"
						: `opacity-100 scale-110 text-[${textColor}]`,
				);
			case "neon":
				return cn(
					baseClasses,
					"text-3xl",
					"drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]",
					fontSizeClass,
					fontStyleClass,
					textColor,
					animateOn && !shouldShowActive
						? "opacity-40 scale-95"
						: "opacity-100 drop-shadow-[0_0_20px_rgba(34,211,238,1)]",
				);
			case "popup":
				return cn(
					baseClasses,
					"text-3xl",
					fontSizeClass,
					fontStyleClass,
					"transition-all duration-300",
					textColor,
					animateOn && !shouldShowActive
						? "opacity-0 scale-50 translate-y-4"
						: "opacity-100 scale-100 translate-y-0",
				);
			case "outline":
				return cn(
					baseClasses,
					fontSizeClass || "text-3xl",
					fontStyleClass,
					"transition-all duration-300",
					"[-webkit-text-stroke:1px_black] [text-stroke:1px_black]",
					textColor,
					animateOn && !shouldShowActive
						? "text-white scale-100"
						: `text-[${textColor}] scale-110`,
				);
			case "fadein":
				return cn(
					baseClasses,
					"text-3xl",
					fontSizeClass,
					fontStyleClass,
					"transition-opacity duration-500",
					`text-[${textColor}]`,
					animateOn && !shouldShowActive
						? "opacity-0"
						: "opacity-100",
				);
			case "bounce":
				return cn(
					baseClasses,
					"text-3xl",
					fontSizeClass,
					fontStyleClass,
					textColor,
					animateOn && !shouldShowActive
						? "opacity-40 text-gray-400"
						: cn(
							"opacity-100 text-green-500",
							wordIndex === currentWordIndex ? "animate-bounce" : ""
						),
				);
			case "typewriter":
				return cn(
					baseClasses,
					fontSizeClass || "text-2xl",
					fontStyleClass,
					"border-r-2 px-1",
					textColor,
					animateOn && !shouldShowActive
						? "opacity-0 border-transparent"
						: "opacity-100 border-black",
				);
			default:
				return baseClasses;
		}
	};

	const getContainerClasses = () => {
		switch (style) {
			case "current":
				return "bg-white backdrop-blur-sm rounded-2xl gap-[6px] px-6 py-4 border-2 border-blue-200 shadow-lg";
			case "recent":
				return "bg-gray-200 backdrop-blur-sm rounded-xl px-6 py-4 gap-3";
			case "marketer":
				return "bg-transparent bg-white rounded-xl px-6 py-4 gap-2";
			case "ali":
				return "bg-black/80 backdrop-blur-sm rounded-2xl px-6 py-3 gap-2";
			case "slay":
				return "bg-transparent px-4 py-2 gap-5 uppercase";
			case "neon":
				return "bg-black/80 backdrop-blur-sm rounded-xl px-6 py-4 gap-2";
			case "popup":
				return "bg-gray-900/80 backdrop-blur-sm rounded-xl px-6 py-4 gap-3";
			case "outline":
				return "bg-gray-800/70 backdrop-blur-sm rounded-xl px-6 py-4 gap-3";
			case "fade-in":
				return "bg-black/70 backdrop-blur-sm rounded-xl px-6 py-4 gap-2";
			case "bounce":
				return "bg-gray-100/90 backdrop-blur-sm rounded-xl px-6 py-4 gap-3 shadow-lg";
			case "typewriter":
				return "bg-amber-50/90 backdrop-blur-sm rounded-xl px-6 py-4 gap-0 border border-amber-200 font-mono";
			default:
				return "px-4 py-2 gap-2";
		}
	};

	if (!text || text.trim().length === 0) {
		return <div style={{ display: "none" }} />;
	}

	return (
		<div
			className={cn(
				"inline-flex flex-wrap items-center justify-center gap-1",
				getContainerClasses(),
			)}
			style={{
				fontFamily: fontFamilies.get(settings?.fontFamily)?.fontFamily,
				fontWeight: fontFamilies.get(settings?.fontFamily)?.fontWeight,
				color: settings?.color,
			}}
		>
			{words.map((word, index) => (
				<span
					key={index}
					className={getStyleClasses(
						index,
						index <= currentWordIndex,
					)}
				>
					{word}
				</span>
			))}
		</div>
	);
};
