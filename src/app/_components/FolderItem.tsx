import Image from "next/image";
import { Card, CardContent } from "~/app/_components/ui/card";
import type { FolderWithMedia } from "~/types";

export function FolderItem({ folder }: { folder: FolderWithMedia }) {
  return (
    <div className="group relative w-64 pt-3">
      {/* Blue stacked file */}
      <div className="absolute left-1/2 top-0 z-[1] h-40 w-[97%] -translate-x-1/2 transform rounded-t-lg bg-blue-500 transition-all group-hover:top-1" />

      {/* Red stacked file */}
      <div className="absolute left-1/2 top-1 z-[2] h-40 w-[99%] -translate-x-1/2 transform rounded-t-lg bg-red-500 transition-all group-hover:top-2" />

      <Card className="relative z-[3] overflow-hidden transition-all hover:shadow-lg group-hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative">
            <div className="relative h-36 w-full overflow-hidden">
              <Image
                src={folder.thumbnailMedia?.url ?? "/placeholder.svg"}
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
