import { MainNav } from "@/components/main-nav";
import { SideNav } from "@/components/side-nav";
import { UserNav } from "@/components/user-nav";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import BreadcrumbComponent from "@/components/breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b sticky top-0 bg-background z-50">
        <div className="flex h-16 items-center px-4">
          <MobileSidebar />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:space-x-4 min-h-screen">
          <SideNav className="hidden md:block w-64 shrink-0 border-r h-screen fixed top-12" />
          <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 md:!ml-60">
            <BreadcrumbComponent />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
