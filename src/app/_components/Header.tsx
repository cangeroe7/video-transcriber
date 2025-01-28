import { Session } from "next-auth";
import Link from "next/link";

interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  return (
    <header className="bg-gray-900 p-4">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          Your Logo
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          {session?.user ? (
            <Link href="/profile" className="text-white hover:text-gray-300">
              Profile
            </Link>
          ) : (
            <Link href="/api/auth/signin" className="text-white hover:text-gray-300">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
