"use client";

import { Player, PlayerRef } from "@remotion/player";
import { MainVideo } from "~/remotion/MyVideo";
import type { Video, Settings, Subtitles } from "~/types";
import { Dispatch, SetStateAction, RefObject } from "react";

export function PreviewWindow({
	videoData,
	transcript,
	settings,
	setSettings,
	selectedStyle,
	showLoading,
	playerRef,
}: {
	videoData: Video;
	transcript: Subtitles;
	settings: Settings;
	setSettings: Dispatch<SetStateAction<Settings>>;
	selectedStyle: string;
	showLoading: boolean;
	playerRef: RefObject<PlayerRef>;
}) {
	if (!videoData) {
		return <div>No video data available.</div>;
	}

	return (
		<div className="absolute inset-0 top-16 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm">
			<div className="relative flex items-start justify-center w-full h-full mt-16">
				<div className="relative z-10 flex items-start justify-center">
					<Player
						component={MainVideo}
						inputProps={{
							subtitles: transcript,
							video: videoData.videoMedia.url,
							settings: settings,
							isRendering: true,
							style: selectedStyle,
							setSettings: setSettings,
						}}
						durationInFrames={(videoData.duration ?? 10) * 30}
						fps={30}
						compositionWidth={videoData.width ?? 1440}
						compositionHeight={videoData.height ?? 1080}
						style={{
              width: "90vw",
              height: "80vh",
              objectFit: "contain",
							borderRadius: 24,
							boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
							background: "#111", // fallback background for letterboxing
						}}
            controls
						ref={playerRef}
					/>
				</div>
				{showLoading && (
					<div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
						<p className="text-lg font-semibold text-gray-700">Loading subtitles…</p>
					</div>
				)}
			</div>
		</div>
	);
}
