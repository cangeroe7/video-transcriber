import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { DashboardSidePanel } from "./dashboard-side-panel";
import { DashboardHeader } from "./dashboard-header";
import { SidebarProvider } from "../_components/ui/sidebar";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <>
      <DashboardHeader/>
      <div className="flex">
        <SidebarProvider>
          <DashboardSidePanel />
        </SidebarProvider>
        <main>
          {children}
        </main>
      </div>
    </>
  );
}