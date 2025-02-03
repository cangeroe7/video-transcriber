import { Session } from "next-auth";
import Link from "next/link";
import ProfileButton from "./ProfileButton";
interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <ProfileButton user={session.user} image={session.user.image ?? "/favicon.ico"} />
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
