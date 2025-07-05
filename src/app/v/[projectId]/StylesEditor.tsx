"use client";

import type React from "react";
import { useState } from "react";
import { Settings } from "~/types";
import { StylesTemplate } from "./StylesTemplate";

export default function SubtitleDemo({
	selectedStyle,
	setSelectedStyle,
	settings,
	setSettings,
}: {
	selectedStyle: string;
	setSelectedStyle: React.Dispatch<React.SetStateAction<string>>;
	settings: Settings;
	setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}) {
	const [activeStyle, setActiveStyle] = useState<string | null>(null);

	const subtitleStyles = [
		{
			id: "current",
			name: "Current",
			text: "Hey there, it's VIDSCRIPT!",
			settings: {
				color: "#000000",
				fontFamily: "Anton",
				bold: true,
				italic: false,
				animate: true,
				revertAfterActive: false,
			},
		},
		{
			id: "recent",
			name: "Cloud",
			text: "Hey there, it's VIDSCRIPT!",
			settings: {
				color: "#51a2ff",
				fontFamily: "Inter SemiBold",
				bold: true,
				italic: false,
				animate: true,
				revertAfterActive: true,
			},
		},
		{
			id: "marketer",
			name: "Pretty Little Marketer",
			text: "Hey there, it's VIDSCRIPT!",
			settings: {
				color: "#ffcdd0",
				fontFamily: "Montserrat ExtraBold",
				bold: true,
				italic: false,
				animate: true,
				revertAfterActive: false,
			},
		},
		{
			id: "ali",
			name: "Ali",
			text: "Hey there, it's VIDSCRIPT!",
			settings: {
				color: "#ffffff",
				fontFamily: "Poppins SemiBold",
				bold: true,
				italic: false,
				animate: true,
				revertAfterActive: false,
			},
		},
		{
			id: "slay",
			name: "Slay",
			text: "Hey there, it's VIDSCRIPT!",
			settings: {
				color: "#51a2ff",
				fontFamily: "Roboto ExtraBold",
				bold: true,
				italic: false,
				animate: true,
				revertAfterActive: true,
			},
		},
		{
			id: "neon",
			name: "Neon Glow",
			text: "Hey there, it's VIDSCRIPT!",
			settings: {
				color: "#22d3ee",
				fontFamily: "Inter SemiBold",
				bold: true,
				italic: false,
				animate: true,
				revertAfterActive: false,
			},
		},
		{
			id: "popup",
			name: "Popup",
			text: "Hey there, it's VIDSCRIPT!",
			settings: {
				color: "#ff7f50", // coral, vibrant and fun
				fontFamily: "Bangers", // playful, bold display font
				bold: true,
				italic: false,
				animate: true,
				revertAfterActive: false,
			},
		},
		{
			id: "outline",
			name: "Outline",
			text: "Hey there, it's VIDSCRIPT!",
			settings: {
				color: "#2b7fff",
				fontFamily: "Anton",
				bold: true,
				italic: false,
				animate: true,
				revertAfterActive: false,
			},
		},
		{
			id: "fadein",
			name: "Fade In",
			text: "Hey there, it's VIDSCRIPT!",
			settings: {
				color: "#2d3748",
				fontFamily: "Squada One",
				bold: "400",
				italic: false,
				animate: true,
				revertAfterActive: false,
			},
		},
		{
			id: "bounce",
			name: "Bounce",
			text: "Hey there, it's VIDSCRIPT!",
			settings: {
				color: "#22c55e",
				fontFamily: "Alfa Slab One",
				bold: "400",
				italic: false,
				animate: true,
				revertAfterActive: true,
			},
		},
		{
			id: "typewriter",
			name: "Typewriter",
			text: "Hey there, it's VIDSCRIPT!",
			settings: {
				color: "#000000",
				fontFamily: "Anton",
				bold: "400",
				italic: false,
				animate: true,
				revertAfterActive: false,
			},
		},
	];

	return (
		<div className="min-h-screen p-4 px-6">
			<div className="mx-auto max-w-4xl space-y-8">
				<div className="grid gap-6">
					{subtitleStyles.map((subtitle) => (
						<div
							key={subtitle.id}
							className={
								"relative cursor-pointer rounded-xl border p-6 backdrop-blur-sm hover:bg-gray-300/80 " +
								(selectedStyle === subtitle.id
									? "border-2 border-[#5666F5] bg-gray-300/80"
									: "border border-[#0000001a] bg-gray-300/70")
							}
							onMouseEnter={() => setActiveStyle(subtitle.id)}
							onMouseLeave={() => setActiveStyle(null)}
							onClick={() => {
								setSelectedStyle(subtitle.id);
								setSettings((prev) => ({
									...prev,
									...subtitle.settings,
									fontSize: prev.fontSize,
								}));
							}}
						>
							<div className="flex flex-col items-center space-y-4 pb-8">
								<div className="flex min-h-[80px] items-center justify-center">
									<StylesTemplate
										text={subtitle.text}
										startTime={0}
										endTime={3}
										style={subtitle.id as any}
										settings={{...subtitle.settings, animate: activeStyle === subtitle.id}}
									/>
								</div>
							</div>
							{/* Bottom bar with subtitle .id as the name */}
							<div className="absolute bottom-0 left-0 right-0 rounded-b-xl border-t bg-white px-4 py-2 text-left font-medium">
								<p>{subtitle.name}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
