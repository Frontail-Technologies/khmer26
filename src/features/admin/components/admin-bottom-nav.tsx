"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChartPieSlice, Flag, List, Storefront, UsersThree, type Icon } from "@phosphor-icons/react"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const TABS: Array<{ href: string; label: string; icon: Icon }> = [
  { href: "/", label: "Overview", icon: ChartPieSlice },
  { href: "/listings", label: "Listings", icon: Storefront },
  { href: "/reports", label: "Reports", icon: Flag },
  { href: "/users", label: "Users", icon: UsersThree },
]

/** Admin routes are served from the admin host root; legacy /admin/* paths are normalised too. */
function normalise(pathname: string): string {
  const path = pathname.replace(/^\/admin(?=\/|$)/, "")
  return path === "" ? "/" : path
}

/** Phone tab bar for the admin panel: the four busiest sections plus the full menu. */
export function AdminBottomNav() {
  const pathname = normalise(usePathname())
  const { setOpenMobile, openMobile } = useSidebar()

  return (
    <nav
      aria-label="Admin"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/90 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_-14px_rgb(0_0_0/0.25)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
    >
      <div className="flex h-16 items-stretch px-1">
        {TABS.map(({ href, label, icon: TabIcon }) => {
          const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "pressable flex flex-1 flex-col items-center justify-center gap-0.5 text-2xs font-semibold transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-all duration-300",
                  active ? "bg-primary/12" : "bg-transparent"
                )}
              >
                <TabIcon size={21} weight={active ? "fill" : "regular"} />
              </span>
              {label}
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => setOpenMobile(true)}
          aria-expanded={openMobile}
          className="pressable flex flex-1 flex-col items-center justify-center gap-0.5 text-2xs font-semibold text-muted-foreground"
        >
          <span className="flex h-7 w-12 items-center justify-center rounded-full">
            <List size={21} />
          </span>
          Menu
        </button>
      </div>
    </nav>
  )
}
