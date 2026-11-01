import type { ReactNode } from "react"
import { Container } from "@/components/layout/Container"
import { AccountSidebar } from "@/features/account/components/account-sidebar"
import { AccountMobileAppBar } from "@/features/account/components/account-mobile-app-bar"

export default function AccountLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <main className="min-h-dvh bg-background pt-0 sm:pt-6 md:pt-8 pb-[calc(var(--mobile-nav-height,4rem)+env(safe-area-inset-bottom,0px)+1rem)] sm:pb-12">
      <Container>
        <AccountMobileAppBar />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20">
            <AccountSidebar />
          </div>
          <div className="lg:col-span-8 xl:col-span-9 min-w-0">
            {children}
          </div>
        </div>
      </Container>
    </main>
  )
}
