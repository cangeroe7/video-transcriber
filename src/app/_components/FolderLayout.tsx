import { FolderItem } from "./FolderItem";
import Link from "next/link";
import type { FolderWithMedia } from "~/types";

export function FolderLayout(props: { folders: FolderWithMedia[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {props.folders.map((folder) => (
        <Link
          draggable={false}
          key={folder.id}
          href={`/dashboard/f/${folder.id}`}
        >
          <FolderItem folder={folder} />
        </Link>
      ))}
    </div>
  );
}
