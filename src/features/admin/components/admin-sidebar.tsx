"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { ArrowSquareOut } from "@phosphor-icons/react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { ADMIN_NAV_CONFIG, isNavItemActive } from "../navigation/admin-navigation"
import { useAdminQueueCounts } from "../navigation/use-admin-queue-counts"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/** Flat, short admin menu: daily work first, money second, everything occasional under Setup. */
function AdminSidebarInner() {
  const marketplaceUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const counts = useAdminQueueCounts()

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b border-border/70 flex justify-center px-4 bg-card/60 group-data-[collapsible=icon]:px-2">
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center justify-center gap-2.5 min-w-0"
          aria-label="offerupkh Admin Dashboard"
        >
          <Image
            src="/images/logo.png"
            alt="offerupkh"
            width={100}
            height={26}
            priority
            style={{ width: "auto" }}
            className="h-6 w-auto object-contain group-data-[collapsible=icon]:hidden"
          />
          <span
            aria-hidden="true"
            className="hidden size-8 items-center justify-center rounded-md bg-primary text-2xs font-extrabold text-primary-foreground group-data-[collapsible=icon]:inline-flex"
          >
            K26
          </span>
          <Badge
            variant="secondary"
            className="h-4.5 px-2 text-3xs font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20 shrink-0 group-data-[collapsible=icon]:hidden rounded-md"
          >
            Admin
          </Badge>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {ADMIN_NAV_CONFIG.map((group) => (
          <SidebarGroup key={group.id} className="py-1">
            <SidebarGroupLabel className="px-3 pb-1 text-2xs font-bold uppercase tracking-wider text-muted-foreground/60">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = isNavItemActive(item, pathname)
                  const count = item.countKey ? counts[item.countKey] : 0
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} onClick={handleLinkClick} />}
                        isActive={active}
                        tooltip={count > 0 ? `${item.title} (${count})` : item.title}
                        className={cn(
                          "relative h-9.5 rounded-xl px-3 text-[13px] font-medium transition-all",
                          active
                            ? "bg-primary/10 font-bold text-primary"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <Icon size={18} weight={active ? "fill" : "duotone"} />
                        <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                        {count > 0 && (
                          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-2xs font-bold tabular-nums text-accent-foreground group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-right-0.5 group-data-[collapsible=icon]:-top-0.5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:min-w-4 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:text-3xs">
                            {count > 99 ? "99+" : count}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/70 p-2.5 bg-card/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<a href={marketplaceUrl} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick} />}
              tooltip="View Public Marketplace"
              className="h-9 px-3 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ArrowSquareOut size={16} weight="duotone" />
              <span className="group-data-[collapsible=icon]:hidden">View Marketplace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export function AdminSidebar() {
  return (
    <Suspense fallback={null}>
      <AdminSidebarInner />
    </Suspense>
  )
}
