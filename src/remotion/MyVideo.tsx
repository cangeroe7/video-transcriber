import { useEffect, useState } from "react";
import {
	AbsoluteFill,
	OffthreadVideo,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { Movable } from "../components/Movable";
import { Subtitle, SubVidProps, Settings } from "~/types";
import { CalculateMetadataFunction } from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";
import { StylesTemplate } from "../app/v/[projectId]/StylesTemplate";
import { FONT_LOADERS } from "./fonts";
import { fontFamilies } from "~/components/ToolBar";

export const MainVideo = (
	inputProps: SubVidProps & {
		setSettings: React.Dispatch<React.SetStateAction<Settings>>;
	},
) => {
	const { subtitles, video, settings, isRendering } = inputProps;
	const fontLoader = settings.fontFamily && FONT_LOADERS[settings.fontFamily];
	const cssFamily = fontLoader ? fontLoader() : undefined;

	const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(
		null,
	);
	const [videoKey, setVideoKey] = useState(0);

	const { fps, durationInFrames, width, height } = useVideoConfig();
	const frame = useCurrentFrame();

	const currentTime = frame / fps;

	useEffect(() => {
		if (!subtitles) return;
		const current = subtitles.find(
			(s) => currentTime >= s.start && currentTime < s.end,
		);
		setCurrentSubtitle(current ?? null);
	}, [currentTime, subtitles]);

	// Calculate font size based on video dimensions (same logic as Movable component)
	const calculateFontSize = () => {
		if (!width || !height) {
			return settings.fontSize;
		}
		
		// Base font size calculation on video dimensions
		// You can adjust these multipliers to get the desired scaling
		const baseFontSize = Math.min(width, height) * 0.02; // 2% of the smaller dimension
		const minFontSize = 12;
		const maxFontSize = Math.min(width, height) * 0.1; // 10% of the smaller dimension
		
		// Use the settings fontSize as a multiplier for user control
		const userMultiplier = settings.fontSize / 10; // Assuming settings.fontSize is a percentage
		const calculatedSize = baseFontSize * userMultiplier;
		
		return Math.max(minFontSize, Math.min(maxFontSize, calculatedSize));
	};

	const dynamicFontSize = calculateFontSize();
	const fontFamily = fontFamilies.get(settings.fontFamily)?.fontFamily ?? "";
	const fontWeight = fontFamilies.get(settings.fontFamily)?.fontWeight ?? "400";

	return (
		<AbsoluteFill className="flex items-center justify-center">
			<div id="subtitle-box" className="relative h-full w-full">
				<OffthreadVideo
					key={videoKey}
					src={video ?? ""}
					onError={(error) => {
						console.error("Video playback error:", error);
						// Force video reload by changing the key
						setVideoKey(prev => prev + 1);
					}}
				/>
				{subtitles && (
					isRendering ? (
						// Simple div for rendering - no movable functionality
						<div
							style={{
								textAlign: "center",
								background: "transparent",
								fontSize: dynamicFontSize,
								color: settings.color,
								fontFamily: fontFamily,
								fontWeight: fontWeight,
								fontStyle: settings.italic ? "italic" : "normal",
								fill: "white",
								position: "absolute",
								width: settings.width,
								height: settings.height,
								left: settings.left,
								top: settings.top,
								userSelect: "none"
							}}
						>
							<StylesTemplate
								text={currentSubtitle?.text ?? ""}
								startTime={currentSubtitle?.start ?? 1}
								endTime={currentSubtitle?.end ?? 5}
								currentTime={currentTime}
								style={inputProps.style}
								settings={settings}
							/>
						</div>
					) : (
						// Movable component for editing
						<Movable
							minWidth={40}
							minHeight={20}
							settings={settings}
							setSettings={inputProps.setSettings}
							videoWidth={width}
							videoHeight={height}
						>
							<StylesTemplate
								text={currentSubtitle?.text ?? ""}
								startTime={currentSubtitle?.start ?? 1}
								endTime={currentSubtitle?.end ?? 5}
								currentTime={currentTime}
								style={inputProps.style}
								settings={settings}
							/>
						</Movable>
					)
				)}
			</div>
		</AbsoluteFill>
	);
};

export const calculateMetaData: CalculateMetadataFunction<
	SubVidProps & {
		setSettings: React.Dispatch<React.SetStateAction<Settings>>;
	}
> = async ({ props }) => {
	const { video } = props; // ignore setSettings
	const { durationInSeconds, width, height } = await getVideoMetadata(
		video ?? "",
	);

	const fps = 30;
	console.log({ durationInSeconds, width, height });

	return {
		durationInFrames: Math.ceil(durationInSeconds * 30),
		fps,
		width: width,
		height: height,
	};
};
