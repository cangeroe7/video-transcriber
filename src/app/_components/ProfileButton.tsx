import Link from "next/link";

export default function ProfileButton() {
  return (
    <Link href="/profile" className="text-white hover:text-gray-300">
      Profile
    </Link>
  );
}

