"use client";

import { useState } from "react";
import Link from "next/link";
import ExportVideo from "~/components/ExportVideo";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { SubVidProps, Video, Settings, Subtitles } from "~/types";
import { format } from "date-fns";
import { PreviewWindow } from "~/app/v/PreviewWindow";
import { Dispatch, SetStateAction, RefObject } from "react";
import { PlayerRef } from "@remotion/player";

export function EditorHeader({
	inputProps,
	videoData,
	transcript,
	settings,
	setSettings,
	selectedStyle,
	showLoading,
	playerRef,
}: {
	inputProps: SubVidProps;
	videoData: Video;
	transcript: Subtitles;
	settings: Settings;
	setSettings: Dispatch<SetStateAction<Settings>>;
	selectedStyle: string;
	showLoading: boolean;
	playerRef: RefObject<PlayerRef>;
}) {
	const [selectedTab, setSelectedTab] = useState<"edit" | "preview">("edit");

	return (
		<>
			<header className="fixed left-0 right-0 top-0 z-10 flex h-16 items-center border-b bg-white px-6">
				{/* Left section: Logo and video info */}
				<div className="flex min-w-0 items-center space-x-4">
					<Link href="/dashboard">
						<svg
							height="42"
							viewBox="0 0 53 58"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M20.5889 2.3455C24.2562 0.269783 28.7438 0.269784 32.4111 2.3455L46.9111 10.5535C50.6739 12.6834 53 16.6731 53 20.9969V37.0037C52.9999 41.3273 50.6737 45.3162 46.9111 47.4461L32.4111 55.6541C28.7438 57.73 24.2562 57.7299 20.5889 55.6541L6.08887 47.4461C2.32625 45.3162 0.000102674 41.3273 0 37.0037V20.9969C0 16.6731 2.32609 12.6834 6.08887 10.5535L20.5889 2.3455ZM10 19.4891L22.4463 41.6893H31.1006L43.5469 19.4891H34.1035L26.7812 35.3572L19.4434 19.4891H10Z"
								fill="black"
							/>
						</svg>
					</Link>
					<div className="ml-2 flex flex-col">
						<span
							contentEditable
							suppressContentEditableWarning
							className="rounded px-2 text-lg font-semibold outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
							style={{ minWidth: 120, maxWidth: 320 }}
						>
							{videoData?.title || "Untitled Video"}
						</span>
						<span className="select-none px-2 text-xs text-gray-500">
							{videoData?.createdAt
								? format(
									new Date(videoData.createdAt),
									"LLL d, yyyy",
								)
								: ""}
						</span>
					</div>
				</div>

				{/* Center section: Navigation */}
				<div className="flex flex-1 justify-center">
					<div className="flex items-center rounded-lg p-1">
						{/* Navigation Tabs */}
						<div className="flex items-center gap-2">
							<Button
								onClick={() => setSelectedTab("edit")}
								variant="ghost"
								size="sm"
								className={cn(
									"rounded-md px-4 py-2 text-sm font-medium transition-colors",
									selectedTab === "edit"
										? "bg-[#119F52]/10 text-[#119F52] hover:bg-[#119F52]/10 hover:text-[#119F52]"
										: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
								)}
							>
								{"Edit"}
							</Button>
							<Button
								onClick={() => setSelectedTab("preview")}
								variant="ghost"
								size="sm"
								className={cn(
									"rounded-md px-4 py-2 text-sm font-medium transition-colors",
									selectedTab === "preview"
										? "bg-[#119F52]/10 text-[#119F52] hover:bg-[#119F52]/10 hover:text-[#119F52]"
										: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
								)}
							>
								{"Preview"}
							</Button>
						</div>
					</div>
				</div>

				{/* Right section: Done button */}
				<div className="ml-24 flex gap-4 min-w-0 items-center">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="lucide lucide-cloud-check-icon lucide-cloud-check"
					>
						<path d="m17 15-5.5 5.5L9 18" />
						<path d="M5 17.743A7 7 0 1 1 15.71 10h1.79a4.5 4.5 0 0 1 1.5 8.742" />
					</svg>
					<ExportVideo inputProps={inputProps} videoData={videoData} />
				</div>
			</header>
			{selectedTab === "preview" && (
				<PreviewWindow
					videoData={videoData}
					transcript={transcript}
					settings={settings}
					setSettings={setSettings}
					selectedStyle={selectedStyle}
					showLoading={showLoading}
					playerRef={playerRef}
				/>
			)}
		</>
	);
}
