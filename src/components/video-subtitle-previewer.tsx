"use client";
import { MainVideo } from "~/remotion/MyVideo";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Slider } from "~/components/ui/slider";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { HexColorPicker } from "react-colorful";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";

import { Player, PlayerRef } from "@remotion/player";
import type { SubVidProps, Subtitles } from "~/types";

import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
import { FontEditor } from "./FontPicker";

function hexToRgba(hex: string, opacity: number): string {
	const sanitizedHex = hex.replace("#", "");
	const bigint = parseInt(sanitizedHex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function VideoSubtitlePreviewer({
	video,
}: {
	video: RouterOutputs["video"]["getVideoById"];
}) {
	if (!video) {
		return <div>NO VIDEO DUMMY</div>;
	}

	const playerRef = useRef<PlayerRef>(null);

	const videoRef = useRef<HTMLVideoElement>(null);
	const [currentTime, setCurrentTime] = useState(0);
	const [currentSubtitle, setCurrentSubtitle] = useState("");
	const [transcript, setTranscript] = useState<Subtitles>([]);
	const [videoData, setVideoData] = useState(video); // store updated video
	const [selectedFont, setSelectedFont] = useState<string | null>(null);

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
				return data.state.data?.ready ? false : 5000;
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

	// Simulate video playback and update current subtitle
	useEffect(() => {
		const interval = setInterval(() => {
			if (videoRef.current) {
				const time = videoRef.current.currentTime;
				setCurrentTime(time);

				// Find the current subtitle based on time
				const subtitle = transcript?.find(
					(sub) => time >= sub.start && time <= sub.end,
				);

				setCurrentSubtitle(subtitle ? subtitle.text : "");
			}
		}, 100);

		return () => clearInterval(interval);
	}, [transcript]);

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
			{/* Video Preview Section */}
			<div className="lg:col-span-2">
				<div className="relative overflow-hidden rounded-lg bg-black">
					<Player
						ref={playerRef}
						component={MainVideo}
						inputProps={{
							subtitles: transcript,
							video: videoData.videoMedia.url,
						}}
						durationInFrames={3960}
						fps={30}
						compositionHeight={1080}
						compositionWidth={1440}
						style={{
							fontFamily: selectedFont || "sans-serif",
							width: "100%",
							position: "relative",
						}}
						autoPlay
					/>
				</div>
			</div>
			<FontEditor selectedFont={selectedFont ?? "arial"} setSelectedFont={setSelectedFont} />
		</div>
	);
}
