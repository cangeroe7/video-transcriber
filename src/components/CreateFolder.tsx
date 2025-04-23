"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import type { VideoWithMedia } from "~/types";

import Image from "next/image";
import { api } from "~/trpc/react";

export default function CreateFolder() {
    const [isOpen, setIsOpen] = useState(false);
    const [folderTitle, setFolderTitle] = useState<string | null>(null);
    const [selectedVideos, setSelectedVideos] = useState<VideoWithMedia[]>([]);
    const [showVideos, setShowVideos] = useState(false);
    const [uploadState, setUploadState] = useState<
        | { state: "IDLE" }
        | { state: "CREATING_FOLDER" }
        | { state: "ADDING_VIDEOS"; folderId: string }
        | { state: "DONE" }
        | { state: "FAILURE"; failure: string }
    >({ state: "IDLE" });

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    let videos: VideoWithMedia[] | null = null;
    try {
        const { data, error } = api.video.getUserVideos.useQuery({});

        if (error) {
            console.error(error);
            return;
        }

        if (data) {
            videos = data.videos;
        }
    } catch (error) {
        console.error(error);
    }

    const toggleVideoSelection = (video: VideoWithMedia) => {
        setSelectedVideos((prev) =>
            prev.some((v) => v.id === video.id)
                ? prev.filter((v) => v.id !== video.id)
                : [...prev, video],
        );
    };

    const resetForm = () => {
        setSelectedVideos([]);
        setShowVideos(false);
        setFolderTitle("");
    };

    const createFolderMutation = api.folder.createFolder.useMutation();
    const addVideosToFolderMutation = api.folder.addVideosToFolder.useMutation();

    const handleSubmit = async () => {
        setUploadState({ state: "CREATING_FOLDER" });
        if (!folderTitle) {
            setUploadState({ state: "FAILURE", failure: "Folder title is required" });
            console.error("Folder title is required");
            return;
        }

        try {
            const folder = await createFolderMutation.mutateAsync({
                title: folderTitle,
            });

            if (!folder?.id) {
                console.error("Failed to create folder");
                return;
            }

            setUploadState({ state: "ADDING_VIDEOS", folderId: folder.id });
        } catch (error) {
            setUploadState({ state: "FAILURE", failure: "Failed to create folder" });
            console.error(error);
            return;
        }

        try {
            if (uploadState.state !== "ADDING_VIDEOS") {
                return;
            }

            await addVideosToFolderMutation.mutateAsync({
                folderId: uploadState.folderId,
                videoIds: selectedVideos.map((video) => video.id),
            });
        } catch (error) {
            setUploadState({
                state: "FAILURE",
                failure: "Failed to add videos to folder",
            });
            console.error(error);
            return;
        }

        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Create Folder</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 p-1">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            id="folderTitle"
                            value={folderTitle ? folderTitle : ""}
                            onChange={(e) => setFolderTitle(e.target.value)}
                            className="col-span-4"
                            placeholder="Enter folder title"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Button
                            variant="outline"
                            className="col-span-4 justify-between"
                            onClick={() => setShowVideos(!showVideos)}
                        >
                            Select Videos
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    {showVideos && (
                        <div
                            draggable={false}
                            className="grid  p-1 grid-cols-3 gap-4 overflow-y-auto"
                        >
                            {videos
                                ? videos.map((video: VideoWithMedia) => {

                                    return (
                                        <div
                                            key={video.id}
                                            className={`align-center relative cursor-pointer overflow-hidden rounded-lg transition-all ${selectedVideos.includes(video)
                                                ? "scale-90 transform ring-[3px] ring-blue-500"
                                                : "ring-1 ring-primary/30"
                                                }`}
                                            onClick={() => {
                                                toggleVideoSelection(video)
                                            }}
                                        >
                                            <Image
                                                src={video.videoMedia?.url.replace("original_videos", "thumbnails") ?? ""}
                                                alt={video.title}
                                                width={160}
                                                height={120}
                                                className="h-auto w-full object-cover"
                                                draggable={false}
                                            />
                                            <div className="px-2 py-1 text-center text-black shadow-neutral-400">
                                                <p className="text-sm font-medium">{video.title}</p>
                                            </div>
                                            {selectedVideos.includes(video) && (
                                                <div className="absolute right-2 top-2 rounded-full bg-blue-500 p-1">
                                                    <Check className="h-4 w-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                                : null}
                        </div>
                    )}
                </div>
                <Button onClick={handleSubmit} disabled={!folderTitle}>
                    Create Folder
                </Button>
            </DialogContent>
        </Dialog>
    );
}
