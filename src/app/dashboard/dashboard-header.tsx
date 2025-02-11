import Link from "next/link"
import { LayoutDashboard } from "lucide-react"
import NewProfileButton from "~/app/_components/ProfileButton"
import { auth } from "~/server/auth"

export async function DashboardHeader() {
  const session = await auth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-white border-b z-10">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <LayoutDashboard className="h-6 w-6" />
        <span className="text-xl font-semibold">Dashboard</span>
      </Link>
      <NewProfileButton user={session?.user} image={session?.user.image ?? "/favicon.ico"} />
      {/* <ProfileButton user={session?.user} image={session?.user.image ?? "/favicon.ico"} /> */}
    </header>
  )
}

