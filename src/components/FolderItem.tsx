"use client";

import Image from "next/image";
import type { FolderWithMedia } from "~/types";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Folder } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function FolderItem({ folder }: { folder: FolderWithMedia }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stacked effect with bars */}
      <div className="absolute -top-2.5 left-3 right-3 z-10 h-2 rounded-t-md bg-gray-200"></div>
      <div className="absolute -top-1.5 left-1.5 right-1.5 z-20 h-1.5 rounded-t-md bg-gray-300"></div>

      {/* Main folder */}
      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-md border bg-background shadow-sm transition-all duration-200",
          "px-3 pb-3 pt-4",
          isHovered ? "translate-y-[-2px] shadow-md" : "",
        )}
      >
        {/* Image container */}
        <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
          {folder.thumbnailMedia?.url ? (
            <Image
              src={folder.thumbnailMedia?.url ?? "/placeholder.svg"}
              alt={folder.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <Folder className="h-12 w-12 opacity-50" />
            </div>
          )}
        </div>

        {/* Folder info */}
        <h3 className="line-clamp-1 text-sm font-medium">{folder.title}</h3>
        <div className="mt-1 flex justify-between">
          <span className="text-xs text-muted-foreground">{10} items</span>
          <span className="text-xs text-muted-foreground">
            {folder.updatedAt
              ? formatDistanceToNow(folder.updatedAt, { addSuffix: true })
              : "Not Updated"}
          </span>
        </div>
      </div>
    </div>
  );
}
