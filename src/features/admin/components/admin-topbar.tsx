"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MagnifyingGlass,
  Bell,
  User,
  ArrowSquareOut,
  SignOut,
  CaretDown,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DEMO_ADMIN_USER } from "../data/demo-admin-dashboard"
import { getAdminRouteInfo } from "../navigation/admin-route-metadata"
import { cn } from "@/lib/utils"

interface AdminTopbarProps {
  className?: string
}

export function AdminTopbar({ className }: AdminTopbarProps) {
  const pathname = usePathname()
  const routeInfo = getAdminRouteInfo(pathname)

  return (
    <header
      className={cn(
        "flex h-16 w-full items-center justify-between border-b border-border/70 bg-card/90 backdrop-blur-md px-4 sm:px-6 shadow-2xs select-none shrink-0 sticky top-0 z-20",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="rounded-lg hover:bg-muted/60" />
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm sm:text-base font-bold text-foreground truncate tracking-tight">
              {routeInfo.title}
            </h1>
            {routeInfo.badge && (
              <Badge
                variant={routeInfo.badgeVariant || "secondary"}
                className="text-[10px] font-bold px-1.5 h-4.5 shrink-0 hidden sm:inline-flex rounded-md"
              >
                {routeInfo.badge}
              </Badge>
            )}
          </div>
          {routeInfo.subtitle && (
            <p className="text-[11px] text-muted-foreground hidden sm:block truncate">
              {routeInfo.subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:flex items-center">
          <MagnifyingGlass
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search listings, users, reports..."
            className="h-9 w-64 lg:w-80 pl-9 pr-3 text-xs bg-muted/30 hover:bg-muted/50 focus:bg-background border border-border/70 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all"
          />
        </div>

        <Link
          href="/admin/notifications"
          aria-label="Admin notifications (3 new)"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <Bell size={18} weight="duotone" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive ring-2 ring-card" />
        </Link>

        <ThemeToggle />

        <div className="h-4 w-px bg-border/60 mx-0.5 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center gap-2 rounded-xl p-1 sm:px-2 sm:py-1 text-left transition-colors hover:bg-muted/60 focus:outline-none cursor-pointer border border-transparent hover:border-border/60"
            aria-label="Admin menu"
          >
            <Avatar className="h-8 w-8 rounded-full border border-border/80 shadow-2xs">
              <AvatarImage src={DEMO_ADMIN_USER.avatar} alt={DEMO_ADMIN_USER.name} />
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                {DEMO_ADMIN_USER.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="hidden xl:flex flex-col min-w-0 pr-1 text-left">
              <span className="text-xs font-bold text-foreground truncate max-w-28 leading-tight">
                {DEMO_ADMIN_USER.name}
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase leading-tight tracking-wider">
                Super Admin
              </span>
            </div>

            <CaretDown size={12} className="text-muted-foreground/60 hidden xl:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-md">
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold text-foreground">{DEMO_ADMIN_USER.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{DEMO_ADMIN_USER.email}</p>
                <div className="pt-1">
                  <Badge variant="outline" className="text-[10px] font-semibold uppercase rounded-md">
                    {DEMO_ADMIN_USER.role.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <Link href="/admin/settings" className="flex items-center gap-2 text-xs font-medium w-full">
                  <User size={15} />
                  <span>Admin Profile & Settings</span>
                </Link>
              }
            />
            <DropdownMenuItem
              render={
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-medium w-full"
                >
                  <ArrowSquareOut size={15} />
                  <span>View Public Marketplace</span>
                </Link>
              }
            />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <Link
                  href="/admin/login"
                  className="flex items-center gap-2 text-xs font-medium text-destructive w-full cursor-pointer"
                >
                  <SignOut size={15} />
                  <span>Sign Out</span>
                </Link>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
