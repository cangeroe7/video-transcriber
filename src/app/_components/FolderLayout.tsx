import { FolderItem } from "./FolderItem";
import Link from "next/link";
import type { FolderWithMedia } from "~/types";

export function FolderLayout(props: { folders: FolderWithMedia[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {props.folders.map((folder, index) => (
        <div key={index} className="flex justify-center">
          <Link
            draggable={false}
            key={folder.id}
            href={`/dashboard/f/${folder.id}`}
          >
            <FolderItem folder={folder} />
          </Link>
        </div>
      ))}
    </div>
  );
}
