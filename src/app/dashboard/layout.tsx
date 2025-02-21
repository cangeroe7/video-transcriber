import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { DashboardSidePanel } from "./dashboard-side-panel";
import { DashboardHeader } from "./dashboard-header";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="grid">
      <DashboardHeader />
      <DashboardSidePanel />
      <main className="ml-48 mt-16">{children}</main>
    </div>
  );
}
