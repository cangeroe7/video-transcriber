"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Button } from "~/app/_components/ui/button"
import { Input } from "~/app/_components/ui/input"
import { Label } from "~/app/_components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/app/_components/ui/select"
import { X } from "lucide-react"
import {folders} from "~/server/db/schema"

export function VideoUpload( props: { folders: (typeof folders.$inferSelect)[]}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("")
  const [newFolder, setNewFolder] = useState("")
  const [fileName, setFileName] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setVideoPreview(null)
    setVideoTitle("")
    setSelectedFolder("")
    setNewFolder("")
    setFileName("")
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileSelect = (file: File) => {
    setFileName(file.name)
    setSelectedFile(file)
    const video = document.createElement("video")
    video.preload = "metadata"
    video.onloadeddata = () => {
      video.currentTime = 1 // Set to 1 second to avoid potential blank frames at the start
      video.onseeked = () => {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height)
        setVideoPreview(canvas.toDataURL())
      }
    }
    video.src = URL.createObjectURL(file)
  }

  const handleRemoveVideo = () => {
    resetForm()
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFile) {
      alert("Please select a video file")
      return
    }

    // Here you would typically send the data to your server
    // For demonstration, we'll just log the data
    console.log({
      file: selectedFile,
      title: videoTitle,
      folder: selectedFolder === "new" ? newFolder : selectedFolder,
    })

    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert("Video uploaded successfully!")
    handleCloseModal()
  }

  return (
    <div>
      <Button onClick={handleButtonClick}>Upload Video</Button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Upload Video</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {videoPreview ? (
                  <div className="space-y-2">
                    <img
                      src={videoPreview || "/placeholder.svg"}
                      alt="Video preview"
                      className="mx-auto max-h-40 object-contain"
                    />
                    <p className="text-sm text-gray-600">{fileName}</p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveVideo()
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <p>Drag and drop a video here, or click to select</p>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="video/*"
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
                  <Select value={selectedFolder} onValueChange={setSelectedFolder} required>
                    <SelectTrigger id="folder-select">
                      <SelectValue placeholder="Select a folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {props.folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>{folder.title}</SelectItem>
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
                <Button type="submit" className="w-full">
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

