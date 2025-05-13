"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { api, RouterOutputs } from "~/trpc/react";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import { Subtitle, Subtitles } from "~/types";
import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import TranscriptEditor from "./TranscriptEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FontEditor } from "~/components/FontPicker";
import { Player, PlayerRef } from "@remotion/player";
import { MainVideo } from "~/remotion/MyVideo";

export function VideoEditor({
	video,
}: {
	video: RouterOutputs["video"]["getVideoById"];
}) {
	if (!video) {
		return <div>NO VIDEO DUMMY</div>;
	}

	const [currentTime, setCurrentTime] = useState(0);
	const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(
		null,
	);
	const [transcript, setTranscript] = useState<Subtitles>([]);
	const [videoData, setVideoData] = useState(video); // store updated video
	const [selectedFont, setSelectedFont] = useState<string | null>(null);

	const playerRef = useRef<PlayerRef>(null);

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

	const { data, isLoading } = api.video.getTranscriptStatus.useQuery(
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
			}
		};

		fetchSubtitles();
	}, [videoData.subtitlesUrl]);

	const isMobile = useMediaQuery("(max-width: 650px)");
	const isTablet = useMediaQuery("(max-width: 1000px)");

	return (
		<div>
			{isLoading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="flex flex-col items-center gap-4 rounded-lg bg-background px-8 py-10 shadow-xl">
						<Loader2
							className="h-12 w-12 animate-spin text-primary"
							aria-label="Loading"
						/>
						<p className="text-center text-sm text-muted-foreground">
							Transcription is being generated…
						</p>
					</div>
				</div>
			)}

			<div className="fixed inset-0 mt-0 flex flex-col pt-16">
				<ResizablePanelGroup direction="horizontal" className="flex-1 overflow-auto">
					{/* subtitles page */}
					<ResizablePanel defaultSize={30} className="flex">
						<Tabs defaultValue="transcript" className="overflow-hidden flex flex-auto flex-col">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="transcript">
									Transcript
								</TabsTrigger>
								<TabsTrigger value="fonts">Fonts</TabsTrigger>
							</TabsList>
							<TabsContent value="transcript" className="overflow-auto">
								<TranscriptEditor transcript={transcript} />
							</TabsContent>
							<TabsContent value="fonts" className="overflow-auto flex-auto">
								<FontEditor
									selectedFont={selectedFont ?? ""}
									setSelectedFont={setSelectedFont}
								/>
							</TabsContent>
						</Tabs>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel>
						<ResizablePanelGroup
							direction="vertical"
							className="h-full"
						>
							<ResizablePanel defaultSize={80} className="relative flex-1">
								<div className="aspect-[2/1]  max-h-full max-w-full">
									<Player
										component={MainVideo}
										inputProps={{
											subtitles: transcript,
											video: videoData.videoMedia.url,
										}}
										durationInFrames={3960}
										fps={30}
										compositionWidth={1440}
										compositionHeight={1080}
										style={{
											width: "fit",
											fontFamily:
												selectedFont ?? "sans-serif",
										}}
										autoPlay
										ref={playerRef}
									/>
								</div>
							</ResizablePanel>
							<ResizableHandle withHandle />
							<ResizablePanel defaultSize={20}>
								<div className="h-full">Bottom Player</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
