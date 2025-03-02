"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { X } from "lucide-react";
import type { folders } from "~/server/db/schema";
import { api } from "~/trpc/react";
import Image from "next/image";

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export function VideoUpload(props: {
  folders: (typeof folders.$inferSelect)[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState("Upload");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<
    | { state: "FAILURE"; failure: string }
    | { state: "IDLE" }
    | { state: "FETCHING" }
    | { state: "UPLOADED"; data: { url: string; id: number } }
    | { state: "SUCCESS" }
  >({ state: "IDLE" });

  const handleButtonClick = () => {
    setIsModalOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const createVideoMutation = api.video.createVideo.useMutation();
  const getSignedURLMutation = api.media.getSignedURL.useMutation();

  const handleCloseModal = () => {
    setStatusMessage("Upload");
    setLoading(false);
    setIsModalOpen(false);
    resetForm();
    document.body.classList.remove("overflow-hidden");
  };

  const resetForm = () => {
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    setSelectedFile(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadeddata = () => {
      video.currentTime = 1; // Set to 1 second to avoid potential blank frames at the start
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              const blobUrl = URL.createObjectURL(blob);
              setVideoPreview(blobUrl);

              const file = new File([blob], fileName, { type: "image/jpeg" });
              setThumbnail(file);
            }
          }, "image/png");
        }
      };
    };
    video.src = URL.createObjectURL(file);
  };

  const handleRemoveVideo = () => {
    resetForm();
  };

  const handleFileUpload = async (
    file: File,
  ): Promise<
    | { ok: true; data: { url: string; id: number } }
    | { ok: false; errorMessage: string }
  > => {
    const checksum = await computeSHA256(file);

    let signedURLResult: Awaited<
      ReturnType<typeof getSignedURLMutation.mutateAsync>
    > | null = null;
    try {
      signedURLResult = await getSignedURLMutation.mutateAsync({
        fileType: file.type,
        fileSize: file.size,
        checksum,
      });
    } catch (error) {
      console.error(error);
      return { ok: false, errorMessage: "Upload Error" };
    }

    if (signedURLResult.failure !== undefined) {
      console.error(signedURLResult.failure);
      return { ok: false, errorMessage: signedURLResult.failure };
    }

    const { url } = signedURLResult.success;

    try {
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
    } catch (error) {
      console.error(error);
      return { ok: false, errorMessage: "Upload Error" };
    }

    return { ok: true, data: signedURLResult.success };
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadState({ state: "FAILURE", failure: "No file selected" });
      return;
    }

    if (!thumbnail) {
      setUploadState({ state: "FAILURE", failure: "No thumbnail selected" });
      return;
    }

    setLoading(true);

    setUploadState({ state: "FETCHING" });

    const uploadResults = await Promise.all([
      handleFileUpload(selectedFile),
      handleFileUpload(thumbnail),
    ]);

    const [videoUpload, thumbnailUpload] = uploadResults;

    if (!videoUpload?.ok) {
      setUploadState({ state: "FAILURE", failure: "Video upload failed" });
      return;
    }

    if (!thumbnailUpload?.ok) {
      setUploadState({ state: "FAILURE", failure: "Thumbnail upload failed" });
      return;
    }

    try {
      await createVideoMutation.mutateAsync({
        title: videoTitle,
        originalMediaVideoId: videoUpload.data.id,
        thumbnailMediaId: thumbnailUpload?.data?.id,
      });
      setUploadState({ state: "SUCCESS" });
    } catch (error) {
      console.error("Database error:", error);
      setUploadState({ state: "FAILURE", failure: "Database upload error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleButtonClick}>Upload Video</Button>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-md rounded-lg bg-white p-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Upload Video</h2>
              <Button variant="default" size="icon" onClick={handleCloseModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div
                className="relative mb-4 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {videoPreview ? (
                  <div className="space-y-2">
                    <Image
                      src={videoPreview || "/placeholder.svg"}
                      layout="responsive"
                      width={0}
                      height={0}
                      alt="Video preview"
                      className="mx-auto max-h-40 object-contain"
                    />
                    <div className="flex items-center justify-center">
                      <p className="text-sm text-gray-600">{fileName}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveVideo();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p>Drag and drop a video here, or click to select</p>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="video/mp4"
                  className="hidden"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-title">Video Title</Label>
                  <Input
                    id="video-title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Enter video title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="folder-select">Select Folder</Label>
                  <Select
                    value={selectedFolder}
                    onValueChange={setSelectedFolder}
                    required
                  >
                    <SelectTrigger id="folder-select">
                      <SelectValue placeholder="Select a folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {props.folders.map((folder) => (
                        <SelectItem
                          key={folder.id}
                          value={folder.id.toString()}
                        >
                          {folder.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">Add New Folder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedFolder === "new" && (
                  <div>
                    <Label htmlFor="new-folder">New Folder Name</Label>
                    <Input
                      id="new-folder"
                      value={newFolder}
                      onChange={(e) => setNewFolder(e.target.value)}
                      placeholder="Enter new folder name"
                      required
                    />
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {statusMessage}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
