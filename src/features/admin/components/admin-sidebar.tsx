"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { ArrowSquareOut, CaretDown, CaretRight } from "@phosphor-icons/react"
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
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { ADMIN_NAV_CONFIG } from "../navigation/admin-navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Listings: true,
  })

  useEffect(() => {
    ADMIN_NAV_CONFIG.forEach((group) => {
      group.items.forEach((item) => {
        if (item.subItems) {
          const isChildActive = item.subItems.some(
            (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`)
          )
          if (isChildActive) {
            setExpandedItems((prev) => ({ ...prev, [item.title]: true }))
          }
        }
      })
    })
  }, [pathname])

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b border-border/70 flex justify-center px-4 bg-card/60">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 min-w-0"
          aria-label="Khmer26 Admin Dashboard"
        >
          <Image
            src="/images/logo.png"
            alt="Khmer26"
            width={100}
            height={26}
            priority
            style={{ width: "auto" }}
            className="h-6 w-auto object-contain"
          />
          <Badge
            variant="secondary"
            className="h-4.5 px-2 text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20 shrink-0 group-data-[collapsible=icon]:hidden rounded-md"
          >
            Admin
          </Badge>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 space-y-1">
        {ADMIN_NAV_CONFIG.map((group) => {
          if (group.id === "overview") {
            const item = group.items[0]
            if (!item) return null
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <SidebarGroup key={group.id} className="pt-0 pb-1">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "h-9.5 px-3 rounded-xl transition-all font-medium text-xs",
                        isActive
                          ? "bg-primary/10 text-primary font-bold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon size={18} weight={isActive ? "fill" : "duotone"} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            )
          }

          return (
            <SidebarGroup key={group.id} className="py-1">
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-3 pb-1">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const hasSubItems = Boolean(item.subItems && item.subItems.length > 0)
                    const isExpanded = Boolean(expandedItems[item.title])

                    if (hasSubItems && item.subItems) {
                      const isAnyChildActive = item.subItems.some(
                        (sub) =>
                          pathname === sub.href ||
                          (sub.href !== "/admin/listings" && pathname.startsWith(`${sub.href}/`)) ||
                          (sub.href === "/admin/listings" && pathname === "/admin/listings")
                      )

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            onClick={() => toggleExpand(item.title)}
                            isActive={isAnyChildActive}
                            tooltip={item.title}
                            className={cn(
                              "h-9 px-3 rounded-xl transition-all text-xs font-medium cursor-pointer w-full justify-between",
                              isAnyChildActive
                                ? "text-primary font-bold bg-primary/5"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon
                                size={17}
                                weight={isAnyChildActive ? "fill" : "duotone"}
                              />
                              <span className="truncate">{item.title}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 group-data-[collapsible=icon]:hidden">
                              {item.badge !== undefined && (
                                <span
                                  className={cn(
                                    "text-[10px] font-bold px-1.5 py-0 h-4 rounded-md inline-flex items-center justify-center",
                                    isAnyChildActive
                                      ? "bg-primary/20 text-primary"
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                              {isExpanded ? (
                                <CaretDown size={12} weight="bold" className="text-muted-foreground/70" />
                              ) : (
                                <CaretRight size={12} weight="bold" className="text-muted-foreground/70" />
                              )}
                            </div>
                          </SidebarMenuButton>

                          {isExpanded && (
                            <SidebarMenuSub className="mt-0.5 space-y-0.5">
                              {item.subItems.map((sub) => {
                                const isSubActive =
                                  sub.href === "/admin/listings"
                                    ? pathname === "/admin/listings" || (pathname.startsWith("/admin/listings/") && !pathname.startsWith("/admin/categories"))
                                    : pathname === sub.href || pathname.startsWith(`${sub.href}/`)

                                return (
                                  <SidebarMenuSubItem key={sub.href}>
                                    <SidebarMenuSubButton
                                      render={<Link href={sub.href} />}
                                      isActive={isSubActive}
                                      className={cn(
                                        "h-8 px-2.5 rounded-lg text-xs transition-colors",
                                        isSubActive
                                          ? "bg-primary/10 text-primary font-bold shadow-2xs"
                                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                      )}
                                    >
                                      <span>{sub.title}</span>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )
                              })}
                            </SidebarMenuSub>
                          )}
                        </SidebarMenuItem>
                      )
                    }

                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={<Link href={item.href} />}
                          isActive={isActive}
                          tooltip={item.title}
                          className={cn(
                            "h-9 px-3 rounded-xl transition-all text-xs font-medium",
                            isActive
                              ? "bg-primary/10 text-primary font-bold shadow-2xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          <Icon
                            size={17}
                            weight={isActive ? "fill" : "duotone"}
                          />
                          <span>{item.title}</span>
                        </SidebarMenuButton>

                        {item.badge !== undefined && (
                          <SidebarMenuBadge
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0 h-4.5 rounded-md",
                              isActive
                                ? "bg-primary/20 text-primary"
                                : item.badgeVariant === "destructive"
                                ? "bg-destructive/15 text-destructive"
                                : item.badgeVariant === "warning"
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/70 p-2.5 bg-card/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              tooltip="View Public Marketplace"
              className="h-9 px-3 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ArrowSquareOut size={16} weight="duotone" />
              <span>View Marketplace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
