"use client"

import { BOTTOM_NAV } from "@/lib/constants/navigation"
import { shouldShowMobileBottomNavigation } from "@/lib/constants/route-policy"
import {
  ChatCircle,
  Compass,
  House,
  Plus,
  User,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

function NavIcon({ name, size = 22 }: { name: string; size?: number }) {
  const props = { size, "aria-hidden": true } as const
  switch (name) {
    case "House":       return <House {...props} />
    case "Compass":     return <Compass {...props} />
    case "Plus":        return <Plus {...props} weight="bold" />
    case "ChatCircle":  return <ChatCircle {...props} />
    case "User":        return <User {...props} />
    default:            return null
  }
}

export function MobileBottomNavigation() {
  const pathname = usePathname()

  if (!shouldShowMobileBottomNavigation(pathname)) {
    return null
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-full rounded-t-2xl border-t border-border/80 bg-card shadow-lg overflow-hidden md:hidden"
    >
      <div className="flex h-16 items-center">
        {BOTTOM_NAV.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          const isSell = item.accent

          if (isSell) {
            return (
              <div key={item.href} className="flex flex-1 items-center justify-center">
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md transition-opacity hover:opacity-90"
                >
                  <NavIcon name={item.icon ?? "Plus"} size={24} />
                </Link>
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <NavIcon name={item.icon ?? "House"} size={22} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-card" />
    </nav>
  )
}
