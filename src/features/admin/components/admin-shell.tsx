import type { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"
import { AdminGuard } from "./admin-guard"
import { AdminBottomNav } from "./admin-bottom-nav"

interface AdminShellProps {
  children: ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <AdminGuard>
      <SidebarProvider defaultOpen={true}>
        <AdminSidebar />
        <SidebarInset className="min-w-0">
          <AdminTopbar />
          <main className="min-w-0 flex-1 p-3.5 sm:p-4.5 lg:px-6 lg:py-4.5 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-[calc(2rem+env(safe-area-inset-bottom,0px))] max-w-[1480px] w-full mx-auto">
            {children}
          </main>
        </SidebarInset>
        <AdminBottomNav />
      </SidebarProvider>
    </AdminGuard>
  )
}
