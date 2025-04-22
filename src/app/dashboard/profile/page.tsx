"use client"

import { HydrateClient } from "~/trpc/server";
import { signOut } from "next-auth/react";

export default function Profile() {
  return (
    <>
      <div>Profile</div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign Out
        </button>
      </div>
    </>
  );
}
