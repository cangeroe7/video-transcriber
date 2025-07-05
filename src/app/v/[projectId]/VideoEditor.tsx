"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { api } from "~/trpc/react";
import { Settings, Subtitles } from "~/types";
import { useState, useEffect, useRef } from "react";
import { Settings as SettingsIcon, Type } from "lucide-react";
import TranscriptEditor from "./TranscriptEditor";
import { Player, PlayerRef } from "@remotion/player";
import { MainVideo } from "~/remotion/MyVideo";
import FloatingToolbar from "~/components/ToolBar";
import ControlsBar from "./ControlsBar";
import type { Video } from "~/types";
import { EditorHeader } from "./Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import SubtitleDemo from "./StylesEditor";

export function VideoEditor({ video }: { video: Video }) {
	if (!video) {
		return <div>NO VIDEO DUMMY</div>;
	}

	const [showLoading, setShowLoading] = useState<boolean>(
		video.subtitlesUrl ? false : true,
	);
	const [transcript, setTranscript] = useState<Subtitles>([]);
	const [videoData, setVideoData] = useState(video); // store updated video
	const [settings, setSettings] = useState<Settings>({
		italic: false,
		fontSize: 24,
		fontFamily: "Anton",
		color: "#000000",
		height: (video.height ?? 1080) * 0.1, // 10% of video height
		width: (video.width ?? 1440) * 0.8, // 80% of video width
		left: (video.width ?? 1440) * 0.1, // 10% from left (centered)
		top: (video.height ?? 1080) * 0.8, // 80% from top (bottom area)
		animate: false,
		revertAfterActive: false,
	});
	const [selectedStyle, setSelectedStyle] = useState<string>("current");

	const playerRef = useRef<PlayerRef>(null);
	const previewRef = useRef<PlayerRef>(null);

	useEffect(() => {
		if (!videoData || !videoData.subtitlesUrl) return;

		const fetchSubtitles = async () => {
			try {
				const res = await fetch(videoData.subtitlesUrl!);
				if (!res.ok) throw new Error("Subtitles not ready");
				const data = await res.json();
				setTranscript(data.content);
			} catch (err) {
				console.error("Failed to fetch transcript", err);
			}
		};

		fetchSubtitles();
	}, [videoData.subtitlesUrl]);

	const { data } = api.video.getTranscriptStatus.useQuery(
		{ videoId: video.id },
		{
			refetchInterval: (data) => {
				return data.state.data?.ready ? false : 3000;
			},
		},
	);

	useEffect(() => {
		if (data?.ready && data.video) {
			setVideoData(data.video);
		}
	}, [data?.ready, data?.video]);

	useEffect(() => {
		if (!videoData || !videoData.subtitlesUrl) return;

		const fetchSubtitles = async () => {
			try {
				const res = await fetch(videoData.subtitlesUrl!);
				if (!res.ok) throw new Error("Subtitles not ready");
				const data = await res.json();
				setTranscript(data.content);
			} catch (err) {
				console.error("Failed to fetch transcript", err);
			} finally {
				setShowLoading(false);
			}
		};

		fetchSubtitles();
	}, [videoData.subtitlesUrl]);
	const [currentSubtitle, setCurrentSubtitle] = useState<number | null>(null);

	return (
		<div>
			<EditorHeader
				inputProps={{
					subtitles: transcript,
					video: video.videoMedia.url,
					isRendering: true,
					settings: settings,
					style: selectedStyle,
				}}
				videoData={videoData}
				transcript={transcript}
				settings={settings}
				setSettings={setSettings}
				selectedStyle={selectedStyle}
				showLoading={showLoading}
				playerRef={previewRef}
			/>

			<div className="fixed inset-0 mt-0 flex flex-col pt-16">
				<ResizablePanelGroup
					direction="vertical"
					className="flex-1 overflow-auto"
				>
					{/* Top section with video and transcript editor */}
					<ResizablePanel defaultSize={80} className="flex flex-col">
						<ResizablePanelGroup
							direction="horizontal"
							className="h-full"
						>
							{/* subtitles page */}
							<ResizablePanel
								defaultSize={40}
								className="flex flex-col"
							>
								{/* Header */}
								<div className="h-full">
									<Tabs
										defaultValue="edit"
										className="flex h-[calc(100%-0px)] flex-col"
									>
										<div className="flex items-center justify-between border-b p-4 px-6">
											{/* Left: Subtitles and Language */}
											<div className="flex items-center gap-3">
												<h2 className="text-lg font-semibold">
													Subtitles
												</h2>
												<div className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700">
													<span className="text-xs">
														US
													</span>
													<span>English</span>
												</div>
											</div>
											{/* Right: Tabs */}
											<TabsList>
												<TabsTrigger value="edit">
													<Type className="mr-1 h-4 w-4" />
													Edit
												</TabsTrigger>
												<TabsTrigger value="styles">
													<SettingsIcon className="mr-1 h-4 w-4" />
													Styles
												</TabsTrigger>
											</TabsList>
										</div>
										<TabsContent
											value="edit"
											className="mt-0 h-[calc(100%-74px)] overflow-auto"
											style={{ scrollbarWidth: "thin" }}
										>
											<TranscriptEditor
												subtitlesState={transcript}
												setSubtitlesState={
													setTranscript
												}
												currentSubtitle={
													currentSubtitle
												}
												setCurrentSubtitle={
													setCurrentSubtitle
												}
												playerRef={playerRef}
												videoDuration={
													videoData.duration ?? 0
												}
												showLoading={showLoading}
											/>
										</TabsContent>
										<TabsContent
											value="styles"
											className="mt-0 h-[calc(100%-74px)] overflow-auto"
											style={{ scrollbarWidth: "thin" }}
										>
											
											<SubtitleDemo
												selectedStyle={selectedStyle}
												setSelectedStyle={
													setSelectedStyle
												}
												settings={settings}
												setSettings={setSettings}
											/>
										</TabsContent>
									</Tabs>
								</div>
							</ResizablePanel>
							<ResizableHandle />
							{/* Video section */}
							<ResizablePanel
								defaultSize={60}
								className="relative flex-1 bg-[#f5f5f6]"
							>
								<>
									<div className="mb-24 flex h-full w-full items-center justify-center overflow-hidden p-10 pb-24">
										<Player
											component={MainVideo}
											inputProps={{
												subtitles: transcript,
												video: videoData.videoMedia.url,
												settings: settings,
												isRendering: false,
												style: selectedStyle,
												setSettings: setSettings,
											}}
											durationInFrames={
												(videoData.duration ?? 10) * 30
											}
											fps={30}
											compositionWidth={
												videoData.width ?? 1440
											}
											compositionHeight={
												videoData.height ?? 1080
											}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "contain",
											}}
											ref={playerRef}
										/>
										<FloatingToolbar
											settings={settings}
											setSettings={setSettings}
										/>
									</div>
								</>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>
					{/* Bottom Controls Bar - now spans full width */}
					<ResizablePanel defaultSize={20}>
						<ControlsBar
							subtitlesState={transcript}
							video={videoData}
							setSubtitlesState={setTranscript}
							currentSubtitle={currentSubtitle}
							setCurrentSubtitle={setCurrentSubtitle}
							playerRef={playerRef}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
