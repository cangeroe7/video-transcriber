"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UserCircle, User, LogOut } from "lucide-react";
import type { User as NextAuthUser } from "next-auth";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProfileButtonProps {
  user?: NextAuthUser;
  image: string | null;
}

export default function ProfileButton({ user, image }: ProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 overflow-hidden rounded-full p-0"
      >
        {image ? (
          <Image
            src={image || "/placeholder.svg"}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <UserCircle className="h-full w-full" />
        )}
      </Button>
      {isOpen && (
        <Card className="absolute right-0 z-10 mt-2 w-64 border shadow-lg">
          <div className="p-4">
            <div className="mb-4 flex items-center space-x-4">
              <div className="ml-3 min-w-0 flex-grow">
                <h3 className="truncate text-sm font-semibold">{user?.name}</h3>
                <p className="truncate text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal"
              onClick={() => {
                setIsOpen(false);
                router.push("/dashboard/profile");
              }}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                signOut({ callbackUrl: "/" }).catch(() =>
                  console.error("Error logging out"),
                );
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
