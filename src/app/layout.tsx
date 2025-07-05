import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "VidScript",
  description: "AI Video Transcription Editor",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
          <SessionProvider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </SessionProvider>
      </body>
    </html>
  );
}
