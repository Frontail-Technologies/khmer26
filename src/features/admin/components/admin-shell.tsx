import type { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"

interface AdminShellProps {
  children: ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset>
        <AdminTopbar />
        <main className="flex-1 p-3.5 sm:p-4.5 lg:px-6 lg:py-4.5 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] max-w-[1480px] w-full mx-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
