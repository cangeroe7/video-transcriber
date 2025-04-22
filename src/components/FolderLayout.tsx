import type { FolderWithMedia } from "~/types";
import { FolderItem } from "~/components/FolderItem";
import Link from "next/link";

export function FolderLayout(props: { folders: FolderWithMedia[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 gap-y-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {props.folders.map((folder: FolderWithMedia) => (
        <Link
          draggable={false}
          key={folder.id}
          href={`/dashboard/f/${folder.id}`}
        >
          <FolderItem key={folder.id} folder={folder} />
        </Link>
      ))}
    </div>
  );
}
