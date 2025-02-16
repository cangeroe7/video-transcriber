"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Button } from "~/app/_components/ui/button"
import { Input } from "~/app/_components/ui/input"
import { Label } from "~/app/_components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/app/_components/ui/select"
import { X } from "lucide-react"
import { folders } from "~/server/db/schema"
import { createVideoProject, getSignedURL } from "./actions"

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

export function VideoUpload( props: { folders: (typeof folders.$inferSelect)[]}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("")
  const [newFolder, setNewFolder] = useState("")
  const [fileName, setFileName] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [statusMessage, setStatusMessage] = useState("Upload")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    setIsModalOpen(true)
    document.body.classList.add("overflow-hidden")
  }

  const handleCloseModal = () => {
    setStatusMessage("Upload")
    setLoading(false)
    setIsModalOpen(false)
    resetForm()
    document.body.classList.remove("overflow-hidden")
  }

  const resetForm = () => {
    setVideoPreview(null)
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

  const handleFileUpload = async (file: File) => {

    const signedURLResult = await getSignedURL(file.type, file.size, await computeSHA256(file))

    if (signedURLResult.failure !== undefined) {
      throw new Error(signedURLResult.failure)
    }

    const { url, id: fileId } = signedURLResult.success
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type
      },
      body: file,
    })

    return fileId
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    try {
      let fileId: number | undefined = undefined
      if (selectedFile) {
        setStatusMessage("Uploading...")
        fileId = await handleFileUpload(selectedFile)
      }

      setStatusMessage("Creating project...")

      createVideoProject(videoTitle, fileId)

      setStatusMessage("Project succesful")
    } catch(e) {
      console.log(e)
      setStatusMessage("Post failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={handleButtonClick}>Upload Video</Button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-hidden flex items-center justify-center transition-opacity duration-300 z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Upload Video</h2>
              <Button variant="default" size="icon" onClick={handleCloseModal}>
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
                    <div className="flex items-center justify-center">
                      <p className="text-sm text-gray-600">{fileName}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveVideo()
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {statusMessage}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

