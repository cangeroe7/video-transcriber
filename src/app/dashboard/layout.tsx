import { auth } from "~/server/auth";

import Header from "~/app/_components/Header";
import Footer from "~/app/_components/Footer";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <>
      {children}
    </>
  );
}

