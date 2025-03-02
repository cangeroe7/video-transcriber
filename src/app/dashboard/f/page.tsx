import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { FolderLayout } from "~/components/FolderLayout";
import CreateFolder from "~/components/CreateFolder";
import type { FolderWithMedia } from "~/types";

export default async function FolderPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { folders }: { folders: FolderWithMedia[] } =
    await api.folder.getUserFolders({});

  return (
    <div className="container mx-auto p-4">
      <div className="align-center mb-4 flex">
        <h1 className="text-2xl font-bold">My Folders</h1>
        <div className="ml-auto">
          <CreateFolder />
        </div>
      </div>

      <FolderLayout folders={folders} />
    </div>
  );
}
