import { Session } from "next-auth";
import Link from "next/link";

interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold hover:text-gray-300">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link 
                  href="/dashboard/profile"
                  className="hover:text-gray-300"
                >
                  Profile
                </Link>

                <Link
                  href="/api/auth/signout"
                  className="rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
