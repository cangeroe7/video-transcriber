import Image from "next/image";
import { Card, CardContent } from "~/app/_components/ui/card";
import type { FolderWithMedia } from "~/types";

export function FolderItem({ folder }: { folder: FolderWithMedia }) {
  return (
    <div className="relative w-64 pt-6">
      <div className="absolute left-1/2 top-0 z-[0] h-40 w-[90%] -translate-x-1/2 transform rounded-t-lg bg-gray-200" />
      <div className="absolute left-1/2 top-2 z-[1] h-40 w-[95%] -translate-x-1/2 transform rounded-t-lg bg-gray-400" />

      <Card className="relative z-10 overflow-hidden transition-shadow hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative">
            <div className="relative h-36 w-full overflow-hidden">
              <Image
                src={
                  folder.thumbnailMedia?.url ??
                  "/placeholder.svg?height=144&width=256"
                }
                alt={folder.title}
                width={256}
                height={144}
                className="rounded-t-lg object-cover"
              />
            </div>
          </div>
          <div className="bg-white p-4">
            <h3 className="mb-1 line-clamp-2 text-lg font-semibold">
              {folder.title}
            </h3>
            <p className="text-sm text-gray-500">
              Last updated:{" "}
              {folder.updatedAt ? folder.updatedAt.toLocaleDateString() : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
