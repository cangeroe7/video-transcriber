
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <>
      <div>
        Dashboard
      </div>
      {children}
    </>
  );
}

