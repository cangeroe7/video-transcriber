import { auth } from "~/server/auth";


export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <>
      {children}
    </>
  );
}

