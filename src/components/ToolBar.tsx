"use client";

import React from "react";
import { Italic } from "lucide-react";
import { Button } from "../components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Settings } from "~/types";
import { ColorPicker } from "./ColorPicker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../components/ui/popover";

const fontSizes = [
	8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
];

export const fontFamilies = new Map<
	string,
	{ fontFamily: string; fontWeight: string }
>([
	["Inter", { fontFamily: "Inter", fontWeight: "400" }],
	["Inter SemiBold", { fontFamily: "Inter", fontWeight: "600" }],
	["Inter ExtraBold", { fontFamily: "Inter", fontWeight: "800" }],
	["Roboto", { fontFamily: "Roboto", fontWeight: "400" }],
	["Roboto SemiBold", { fontFamily: "Roboto", fontWeight: "600" }],
	["Roboto ExtraBold", { fontFamily: "Roboto", fontWeight: "800" }],
	["Poppins", { fontFamily: "Poppins", fontWeight: "400" }],
	["Poppins SemiBold", { fontFamily: "Poppins", fontWeight: "600" }],
	["Poppins ExtraBold", { fontFamily: "Poppins", fontWeight: "800" }],
	["Montserrat", { fontFamily: "Montserrat", fontWeight: "400" }],
	["Montserrat SemiBold", { fontFamily: "Montserrat", fontWeight: "600" }],
	["Montserrat ExtraBold", { fontFamily: "Montserrat", fontWeight: "800" }],
	["Anton", { fontFamily: "Anton", fontWeight: "400" }],
	["Zen Loop", { fontFamily: "Zen Loop", fontWeight: "400" }],
	["Squada One", { fontFamily: "Squada One", fontWeight: "400" }],
	["Alfa Slab One", { fontFamily: "Alfa Slab One", fontWeight: "400" }],
	["Bangers", { fontFamily: "Bangers", fontWeight: "400" }],
	["Bitter", { fontFamily: "Bitter", fontWeight: "400" }],
	["Cabin", { fontFamily: "Cabin", fontWeight: "400" }],
	["Cinzel", { fontFamily: "Cinzel", fontWeight: "400" }],
	["Crimson Pro", { fontFamily: "Crimson Pro", fontWeight: "400" }],
	["DM Serif Display", { fontFamily: "DM Serif Display", fontWeight: "400" }],
]);

export default function FloatingToolbar({
	settings,
	setSettings,
}: {
	settings: Settings;
	setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}) {
	// const toggleBold = () => {
	// 	setSettings((prev) => ({
	// 		...prev,
	// 		bold: !prev.bold,
	// 	}));
	// };

	const toggleItalic = () => {
		setSettings((prev) => ({
			...prev,
			italic: !prev.italic,
		}));
	};

	const handleFontSizeChange = (size: string) => {
		setSettings((prev) => ({
			...prev,
			fontSize: Number(size),
		}));
	};

	const handleFontFamilyChange = (family: string) => {
		setSettings((prev) => ({
			...prev,
			fontFamily: family,
		}));
	};

	const handleColorChange = (color: string) => {
		setSettings((prev) => ({
			...prev,
			color,
		}));
	};

	return (
		<div className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 transform select-none">
			<div className="flex items-center justify-start gap-1 rounded-lg bg-white p-1 shadow-lg">
				{/* Font Family Selector */}

				<Select
					value={settings.fontFamily}
					onValueChange={handleFontFamilyChange}
				>
					<SelectTrigger className="h-8 w-fit border-0 text-sm shadow-none">
						<SelectValue>
							{settings.fontFamily && (
								<span
									style={{
										fontFamily: fontFamilies.get(
											settings.fontFamily,
										)?.fontFamily,
										fontWeight: fontFamilies.get(
											settings.fontFamily,
										)?.fontWeight,
										whiteSpace: "nowrap",
										overflow: "visible",
										textOverflow: "clip",
										maxWidth: "none",
										display: "inline-block",
									}}
								>
									{settings.fontFamily}
								</span>
							)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent
						align="start"
						sideOffset={8}
						alignOffset={-8}
						className="max-h-64 overflow-auto"
					>
						{Array.from(fontFamilies.keys()).map((key) => {
							const font = fontFamilies.get(key)!;
							return (
								<SelectItem
									key={key}
									value={key}
									style={{
										fontFamily: font.fontFamily,
										fontWeight: font.fontWeight,
									}}
								>
									{key}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>

				<Separator
					orientation="vertical"
					className="mx-1 h-8"
					style={{ backgroundColor: "#f3f3f3" }}
				/>

				{/* Font Size Selector */}
				<Select
					value={String(settings.fontSize)}
					onValueChange={handleFontSizeChange}
				>
					<SelectTrigger className="h-8 w-16 border-0 text-sm shadow-none">
						<SelectValue />
					</SelectTrigger>
					<SelectContent
						align="start"
						sideOffset={8}
						alignOffset={-8}
						className="max-h-64 overflow-auto"
					>
						{fontSizes.map((size) => (
							<SelectItem key={size} value={size.toString()}>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Separator
					orientation="vertical"
					className="mx-1 h-8"
					style={{ backgroundColor: "#f3f3f3" }}
				/>

				{/* Italic Button */}
				<Button
					variant={settings.italic ? "default" : "ghost"}
					size="sm"
					className="mr-2 h-8 w-8 p-0"
					onClick={toggleItalic}
				>
					<Italic className="h-4 w-4" />
				</Button>

				{/* Color Picker */}
				<ColorPicker
					value={settings.color}
					onChange={handleColorChange}
					className="h-6 w-6 rounded-full p-0"
				/>

				<Separator
					orientation="vertical"
					className="mx-1 h-8"
					style={{ backgroundColor: "#f3f3f3" }}
				/>

				{/* Animation Option Popover */}
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="flex h-8 w-24 items-center gap-1 p-0"
							title="Animation"
						>
							<span className="flex items-center gap-1">
								<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="16" height="16" viewBox="0 0 36 36" style={{ display: 'inline', verticalAlign: 'middle' }}>
									<title>animation_line</title>
									<g id="b9dc111b-c0fc-4dae-9c72-b1a6d11e341d" data-name="Layer 3">
										<path d="M10.16,31.71a4.4,4.4,0,0,1-4.64-1A4.34,4.34,0,0,1,4.23,27.6a4.41,4.41,0,0,1,.18-1.2,11.61,11.61,0,0,1-1-2.56,6.4,6.4,0,0,0,9.33,8.63A11.55,11.55,0,0,1,10.16,31.71Z"/>
										<path d="M18.41,27.68a7.61,7.61,0,0,1-9.08-1.26,7.58,7.58,0,0,1-1.27-9.06,14.26,14.26,0,0,1-.37-2.85,9.58,9.58,0,0,0,.22,13.33,9.63,9.63,0,0,0,13.35.22A14.46,14.46,0,0,1,18.41,27.68Z"/>
										<path d="M21.66,26.21a12.1,12.1,0,1,1,8.57-3.54h0A12.11,12.11,0,0,1,21.66,26.21ZM21.66,4A10.11,10.11,0,0,0,11.54,14.11a10,10,0,0,0,3,7.14,10.12,10.12,0,0,0,14.31,0A10.11,10.11,0,0,0,21.66,4Zm7.86,18h0Z"/>
									</g>
								</svg>
								Animation
							</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent
						align="center"
						side="top"
						sideOffset={8}
						alignOffset={0}
						className="w-auto p-2"
					>
						<div className="flex flex-row items-end justify-center gap-4">
							{/* None */}
							<div
								className="flex cursor-pointer flex-col items-center"
								onClick={() =>
									setSettings((prev) => ({
										...prev,
										animate: false,
										revertAfterActive: false,
									}))
								}
							>
								<div
									className={`flex h-20 w-20 flex-col items-center justify-center rounded-xl ${!settings.animate && !settings.revertAfterActive ? "bg-[#EBEDFF]" : "bg-gray-100"}`}
									style={{
										transition:
											"box-shadow 0.2s, border 0.2s",
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="32"
										height="32"
										fill="none"
										viewBox="0 0 16 16"
									>
										<g clipPath="url(#a)">
											<path
												stroke={
													!settings.animate &&
													!settings.revertAfterActive
														? "#5666F5"
														: "#A0A0A0"
												}
												strokeWidth="1.2"
												strokeLinecap="round"
												strokeLinejoin="round"
												d="m12.9 3.001-9.8 9.9M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"
											></path>
										</g>
										<defs>
											<clipPath id="a">
												<path
													fill="#fff"
													d="M0 0h16v16H0z"
												></path>
											</clipPath>
										</defs>
									</svg>
								</div>
								<span
									className="mt-2 text-sm font-medium"
									style={{
										color:
											!settings.animate &&
											!settings.revertAfterActive
												? "#5666F5"
												: "#444444",
									}}
								>
									None
								</span>
							</div>
							{/* Highlight */}
							<div
								className="flex cursor-pointer flex-col items-center"
								onClick={() =>
									setSettings((prev) => ({
										...prev,
										animate: true,
										revertAfterActive: true, // switched to true for Highlight
									}))
								}
							>
								<div
									className={`flex h-20 w-20 flex-col items-center justify-center rounded-xl shadow-sm ${settings.animate && settings.revertAfterActive ? "bg-[#EBEDFF] ring-2 ring-[#A3B1FF]" : "border border-[#D1D5DB] bg-white"}`}
									style={{
										transition:
											"box-shadow 0.2s, border 0.2s",
									}}
								>
									<span
										className="text-sm font-medium"
										style={{
											lineHeight: "1.2",
											color:
												settings.animate && settings.revertAfterActive
													? "#A0A0A0"
													: "#A0A0A0",
										}}
									>
										The quick
									</span>
									<span
										className="text-sm font-bold"
										style={{
											lineHeight: "1.2",
											color:
												settings.animate && settings.revertAfterActive
													? "#5666F5"
													: "#A0A0A0",
										}}
									>
										brown
									</span>
									<span
										className="text-sm font-medium"
										style={{
											lineHeight: "1.2",
											color:
												settings.animate && settings.revertAfterActive
													? "#A0A0A0"
													: "#A0A0A0",
										}}
									>
										fox
									</span>
								</div>
								<span
									className="mt-2 text-sm font-medium"
									style={{
										color:
											settings.animate && settings.revertAfterActive
												? "#5666F5"
												: "#444444",
									}}
								>
									Highlight
								</span>
							</div>
							{/* Karaoke */}
							<div
								className="flex cursor-pointer flex-col items-center"
								onClick={() =>
									setSettings((prev) => ({
										...prev,
										animate: true,
										revertAfterActive: false, // switched to false for Karaoke
									}))
								}
							>
								<div
									className={`flex h-20 w-20 flex-col items-center justify-center rounded-xl shadow-sm ${settings.animate && !settings.revertAfterActive ? "bg-[#EBEDFF] ring-2 ring-[#A3B1FF]" : "border border-[#D1D5DB] bg-white"}`}
									style={{
										transition:
											"box-shadow 0.2s, border 0.2s",
									}}
								>
									<span
										className="text-sm font-bold"
										style={{
											lineHeight: "1.2",
											color:
												settings.animate && !settings.revertAfterActive
													? "#5666F5"
													: "#A0A0A0",
										}}
									>
										The quick
									</span>
									<span
										className="text-sm font-bold"
										style={{
											lineHeight: "1.2",
											color:
												settings.animate && !settings.revertAfterActive
													? "#5666F5"
													: "#A0A0A0",
										}}
									>
										brown
									</span>
									<span
										className="text-sm font-medium"
										style={{
											lineHeight: "1.2",
											color:
												settings.animate && !settings.revertAfterActive
													? "#5666F5"
													: "#A0A0A0",
										}}
									>
										fox
									</span>
								</div>
								<span
									className="mt-2 text-sm font-medium"
									style={{
										color:
											settings.animate && !settings.revertAfterActive
												? "#5666F5"
												: "#444444",
									}}
								>
									Karaoke
								</span>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
