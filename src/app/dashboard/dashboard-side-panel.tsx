"use client";
import Link from "next/link";
import { Video, Folder, Settings } from "lucide-react";

export function DashboardSidePanel() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-48 overflow-y-auto border-r bg-gray-100">
      <nav className="flex h-full justify-center p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center rounded-lg p-2 hover:bg-gray-200"
            >
              <Video className="mr-2 h-4 w-4" />
              <span>Videos</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/f"
              className="flex items-center rounded-lg p-2 hover:bg-gray-200"
            >
              <Folder className="mr-2 h-4 w-4" />
              <span>Folders</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/settings"
              className="flex items-center rounded-lg p-2 hover:bg-gray-200"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
