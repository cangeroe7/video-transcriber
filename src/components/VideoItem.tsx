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

export function VideoItem({ video }: { video: VideoWithMedia }) {
    const [title, setTitle] = useState(video.title);

    const updateVideoTitleMutiation = api.video.updateVideoTitle.useMutation();
    const handleRename = async () => {
        const newTitle = prompt("Enter new title:", title);
        if (newTitle) {
            setTitle(newTitle);
            await updateVideoTitleMutiation.mutateAsync({
                videoId: video.id,
                title: newTitle,
            });
        }
    };

    const handleRemove = () => {
        if (confirm("Are you sure you want to remove this video?")) {
            console.log(`Removed video: ${title}`);
        }
    };

    return (
        <div className="cursor-pointer rounded-lg bg-white p-2 shadow-md transition active:bg-gray-200 active:shadow-lg">
            <div className="flex">
                <Image
                    src={video.videoMedia?.url.replace("original_videos", "thumbnails") ?? ""}
                    alt={title}
                    width={200}
                    height={120}
                    draggable={false}
                    className="h-auto w-full rounded-md"
                />
            </div>
            <h2 className="mt-2 truncate text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-500">
                Last opened:{" "}
                {video.updatedAt ? video.updatedAt.toLocaleDateString() : "N/A"}
            </p>
            <div className="mt-2 flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
