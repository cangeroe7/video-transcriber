"use client"
import Link from "next/link"
import { Video, Image, Settings } from "lucide-react"

export function DashboardSidePanel() {
  return (
    <aside className="fixed left-0 top-16 w-48 h-[calc(100vh-4rem)] bg-gray-100 border-r overflow-y-auto">
      <nav className="p-4 flex justify-center h-full">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="flex items-center p-2 rounded-lg hover:bg-gray-200">
              <Video className="mr-2 h-4 w-4" />
              <span>Videos</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/albums" className="flex items-center p-2 rounded-lg hover:bg-gray-200">
              <Image className="mr-2 h-4 w-4" />
              <span>Albums</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings" className="flex items-center p-2 rounded-lg hover:bg-gray-200">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
