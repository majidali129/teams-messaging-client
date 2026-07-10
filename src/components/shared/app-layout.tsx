import { useState } from "react";
import { Outlet } from "react-router";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { WorkspacesSidebarContent } from "@/features/workspaces/components/sidebar";
import { Header } from "./header";
import { useAppSocket } from "@/sockets/use-app-socket";

export const AppLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useAppSocket();
 

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden shrink-0 border-r md:flex">
        <WorkspacesSidebarContent />
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <WorkspacesSidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
