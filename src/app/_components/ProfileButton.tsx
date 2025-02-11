"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { UserCircle, User, LogOut } from "lucide-react"
import { User as NextAuthUser } from "next-auth";
import { Button } from "~/app/_components/ui/button"
import { Card } from "~/app/_components/ui/card"
import { Separator } from "~/app/_components/ui/separator"
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";


interface ProfileButtonProps {
  user?: NextAuthUser;
  image: string | null;
}

export default function NewProfileButton({ user, image }: ProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button onClick={() => setIsOpen(!isOpen)} className="rounded-full p-0 w-10 h-10 overflow-hidden">
        {image ? (
          <Image src={image || "/placeholder.svg"} alt="Profile" width={40} height={40} className="rounded-full" />
        ) : (
          <UserCircle className="w-full h-full" />
        )}
      </Button>
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-64 z-10 shadow-lg border">
          <div className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="ml-3 flex-grow min-w-0">
                <h3 className="font-semibold text-sm truncate">{user?.name}</h3>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Separator className="my-2" />
            <Button variant="ghost" className="w-full justify-start text-sm font-normal" onClick={() => {
              setIsOpen(false);
              redirect("/dashboard/profile");
              }
            }>
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                signOut();
                redirect("/");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

