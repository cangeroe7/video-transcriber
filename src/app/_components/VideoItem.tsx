"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreVertical, Edit2, Trash2 } from "lucide-react"
import { Button } from "~/app/_components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/app/_components/ui/dropdown-menu"
import { videos } from "~/server/db/schema"

export function VideoItem({ video }: { video: typeof videos.$inferSelect }) {
  const [title, setTitle] = useState(video.title)

  const handleRename = () => {
    const newTitle = prompt("Enter new title:", title)
    if (newTitle) {
      setTitle(newTitle)
    }
  }

  const handleRemove = () => {
    if (confirm("Are you sure you want to remove this video?")) {
      // In a real application, you would remove the video from the list
      // and possibly update the backend. For this example, we'll just log.
      console.log(`Removed video: ${title}`)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex">
        <Image
          src={video.originalVideoUrl || "/placeholder.svg"}
          alt={title}
          width={200}
          height={120}
          className="w-full h-auto rounded-md"
        />
      </div>
      <h2 className="mt-2 text-lg font-semibold truncate">{title}</h2>
      <p className="text-sm text-gray-500">
        Last opened: {video.updatedAt ? video.updatedAt.toLocaleDateString() : "N/A"}
      </p>
      <div className="mt-2 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
  )
}

