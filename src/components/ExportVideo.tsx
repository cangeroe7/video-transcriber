"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Clock, Download, Info } from "lucide-react";
import Image from "next/image";
import { SubVidProps, Video } from "~/types";
import { useRendering } from "~/helpers/use-rendering";
import { DownloadButton } from "~/components/ui/download-button";
import { ErrorComp } from "~/components/ui/error";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const formatTime = (time: number) => {
	const minutes = Math.floor(time / 60);
	const seconds = (time % 60).toFixed(1);
	return `${minutes.toString().padStart(2, "0")}:${seconds.padStart(4, "0")}`;
};

export default function ExportVideo({
	inputProps,
	videoData,
}: {
	inputProps: SubVidProps;
	videoData: Video;
}) {
	const { renderMedia, state, undo } = useRendering("MyVideo", inputProps);
	const [isOpen, setIsOpen] = useState(false);
	const [quality, setQuality] = useState("standard");
	const [burnSubtitles, setBurnSubtitles] = useState(true);

	const handleExport = () => {
		renderMedia();
	};

	const resetModal = () => {
		// Optionally reset quality/burnSubtitles if you want
	};

	useEffect(() => {
		if (!isOpen) {
			setTimeout(resetModal, 300);
		}
	}, [isOpen]);

	const renderContent = () => {
		if (
			state.status === "init" ||
			state.status === "invoking" ||
			state.status === "error"
		) {
			return (
				<div className="space-y-6">
					{/* Video Preview */}
					<div className="relative max-h-[60vh] overflow-hidden rounded-lg bg-black">
						<Image
							src={
								inputProps.video?.replace(
									"/original_videos/",
									"/thumbnails/",
								) ?? ""
							}
							alt="Video preview"
							width={356}
							height={200}
							className="h-full w-full object-cover"
						/>
					</div>

					{/* Duration */}
					<div className="flex items-center gap-2 text-gray-600">
						<Clock className="h-4 w-4" />
						<span className="text-sm">
							{formatTime(videoData?.duration ?? 10)}
						</span>
					</div>

					{/* Quality Selection */}
					<div className="space-y-2">
						<Label
							htmlFor="quality"
							className="text-sm font-medium text-gray-700"
						>
							Quality
						</Label>
						<div className="flex gap-2">
							<Select value={quality} onValueChange={setQuality}>
								<SelectTrigger className="flex-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="standard">
										Standard
									</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="ultra">Ultra</SelectItem>
								</SelectContent>
							</Select>
							<Button
								variant="outline"
								size="icon"
								className="shrink-0 bg-transparent"
							>
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
									/>
								</svg>
							</Button>
						</div>
					</div>

					{/* Burn Subtitles */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Label
								htmlFor="burn-subtitles"
								className="text-sm font-medium text-gray-700"
							>
								Burn Subtitles
							</Label>
							<Info className="h-4 w-4 text-gray-400" />
						</div>
						<Switch
							id="burn-subtitles"
							checked={burnSubtitles}
							onCheckedChange={setBurnSubtitles}
						/>
					</div>

					{/* Export Button */}
					<Button
						onClick={handleExport}
						className="w-full bg-[#5666F5] py-3 text-white hover:bg-[#434EEA]"
						disabled={state.status === "invoking"}
					>
						<Download className="mr-2 h-4 w-4" />
						Export Video
					</Button>
					{state.status === "error" ? (
						<ErrorComp message={state.error.message} />
					) : null}
				</div>
			);
		}
		if (state.status === "rendering" || state.status === "done") {
			return (
				<div className="space-y-6 text-center">
					{/* Video Preview with blur and progress overlay during rendering */}
					<div className="relative max-h-[60vh] overflow-hidden rounded-lg bg-black">
						<Image
							src={
								inputProps.video?.replace(
									"/original_videos/",
									"/thumbnails/",
								) ?? ""
							}
							alt="Video preview"
							width={356}
							height={200}
							className={state.status === 'rendering' ? "h-full w-full object-cover blur-sm" : "h-full w-full object-cover"}
						/>
						{state.status === 'rendering' && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="flex items-center justify-center w-full h-full">
									<div className="w-24 h-24 flex items-center justify-center mx-auto my-auto">
										<CircularProgressbar
											value={Math.round((state.progress ?? 0) * 100)}
											text={`${Math.round((state.progress ?? 0) * 100)}%`}
											styles={buildStyles({
												pathColor: '#5666F5',
												textColor: '#5666F5',
												trailColor: '#e5e7eb',
											})}
										/>
									</div>
								</div>
							</div>
						)}
					</div>
					{state.status === 'rendering' && (
						<p className="text-gray-500 text-sm mt-2">Rendering your video, this might take a few minutes...</p>
					)}
					{state.status === "done" ? (
						<DownloadButton undo={undo} state={state} />
					) : null}
					{state.status === 'rendering' && (
						<DownloadButton undo={undo} state={state} />
					)}
				</div>
			);
		}
		return null;
	};

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button className="bg-[#5666F5] px-8 py-2 text-white hover:bg-[#434EEA]">
						Export
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold text-gray-900">
							{state.status === "init" && "Export Video"}
							{state.status === "invoking" && "Processing"}
							{state.status === "rendering" && "Rendering"}
							{state.status === "done" && "Download Ready"}
						</DialogTitle>
					</DialogHeader>
					{renderContent()}
				</DialogContent>
			</Dialog>
		</div>
	);
}
