"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";
import type { VideoWithMedia } from "~/types";
import { formatDistance, subDays } from "date-fns";

export function VideoItem({ video }: { video: VideoWithMedia }) {
	const [title, setTitle] = useState(video.title);

	const updateVideoTitleMutation = api.video.updateVideoTitle.useMutation();
	const deleteVideoMutation = api.video.deleteVideo.useMutation();

	const handleRename = async () => {
		const newTitle = prompt("Enter new title:", title);
		if (newTitle) {
			setTitle(newTitle);
			await updateVideoTitleMutation.mutateAsync({
				videoId: video.id,
				title: newTitle,
			});
		}
	};

	const handleRemove = async () => {
		if (confirm("Are you sure you want to remove this video?")) {
			await deleteVideoMutation.mutateAsync({
				videoId: video.id
			})
		}
	};

	return (
		<div className="cursor-pointer rounded-lg transition active:bg-gray-200 group z-10">
			<div className="relative bg-black/10 rounded-md aspect-video w-full overflow-hidden group-hover:bg-black/15">
				<Image
					src={
						video.videoMedia?.url.replace(
							"original_videos",
							"thumbnails",
						) ?? ""
					}
					alt={title}
                    fill
					draggable={false}
					className="rounded-md object-contain "
				/>
			</div>
			<div className="mt-1 flex items-center justify-between">
				<div>
					<h2 className="mt-1 truncate text-sm font-semibold">
						{title}
					</h2>
					<p className="text-xs text-gray-500">
						Last viewed{" "}
						{video.updatedAt
							? formatDistance(
									video.updatedAt, new Date(), {
										addSuffix: true,
									},
								)
							: "N/A"}
					</p>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreVertical className="h-4 w-4 text-black/60" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						onClick={(e) => e.stopPropagation()}
					>
						<DropdownMenuItem onClick={handleRename}>
							<Edit2 className="mr-2 h-4 w-4" />
							<span>Rename</span>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleRemove}>
							<Trash2 className="mr-2 h-4 w-4" />
							<span>Remove</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
