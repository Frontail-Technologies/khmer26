"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
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
  useSidebar,
} from "@/components/ui/sidebar"
import { ADMIN_NAV_CONFIG } from "../navigation/admin-navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function checkSubItemActive(
  subHref: string,
  currentPathname: string,
  currentSection: string | null
): boolean {
  if (subHref.includes("?")) {
    const [subPath, subQuery] = subHref.split("?")
    if (currentPathname !== subPath) return false
    const parsed = new URLSearchParams(subQuery)
    const targetSection = parsed.get("section")
    if (targetSection === "general") {
      return currentSection === "general" || !currentSection
    }
    return currentSection === targetSection
  }

  if (subHref === "/listings") {
    return (
      currentPathname === "/listings" ||
      (currentPathname.startsWith("/listings/") &&
        !currentPathname.startsWith("/categories") &&
        !currentPathname.startsWith("/listing-fields"))
    )
  }

  if (subHref === "/chats") {
    return (
      currentPathname === "/chats" ||
      (currentPathname.startsWith("/chats/") &&
        !currentPathname.startsWith("/reported-chats"))
    )
  }

  return currentPathname === subHref || currentPathname.startsWith(`${subHref}/`)
}

function AdminSidebarInner() {
  const marketplaceUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSection = searchParams.get("section")
  const { isMobile, setOpenMobile, state } = useSidebar()

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    Listings: true,
    Reports: false,
    "Content Management": false,
    "Chat Management": false,
    Settings: false,
  })

  useEffect(() => {
    ADMIN_NAV_CONFIG.forEach((group) => {
      group.items.forEach((item) => {
        if (item.subItems && item.subItems.length > 0) {
          const isChildActive = item.subItems.some((sub) =>
            checkSubItemActive(sub.href, pathname, currentSection)
          )
          if (isChildActive) {
            setExpandedItems((prev) => ({ ...prev, [item.title]: true }))
          }
        }
      })
    })
  }, [pathname, currentSection])

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b border-border/70 flex justify-center px-4 bg-card/60 group-data-[collapsible=icon]:px-2">
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center justify-center gap-2.5 min-w-0"
          aria-label="Khmer26 Admin Dashboard"
        >
          <Image
            src="/images/logo.png"
            alt="Khmer26"
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
                      render={<Link href={item.href} onClick={handleLinkClick} />}
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
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            )
          }

          return (
            <SidebarGroup key={group.id} className="py-1">
              <SidebarGroupLabel className="text-2xs font-bold uppercase tracking-wider text-muted-foreground/60 px-3 pb-1">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const hasSubItems = Boolean(item.subItems && item.subItems.length > 0)
                    const isExpanded = Boolean(expandedItems[item.title])

                    if (hasSubItems && item.subItems) {
                      const isAnyChildActive = item.subItems.some((sub) =>
                        checkSubItemActive(sub.href, pathname, currentSection)
                      )

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            render={
                              state === "collapsed" ? (
                                <Link href={item.href} onClick={handleLinkClick} />
                              ) : undefined
                            }
                            onClick={
                              state === "expanded"
                                ? () => toggleExpand(item.title)
                                : undefined
                            }
                            isActive={isAnyChildActive}
                            tooltip={item.title}
                            className={cn(
                              "h-9 px-3 rounded-xl transition-all text-xs font-medium cursor-pointer w-full justify-between",
                              isAnyChildActive
                                ? "text-primary font-bold bg-primary/5"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            <div className="flex min-w-0 items-center gap-2 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
                              <Icon
                                size={17}
                                weight={isAnyChildActive ? "fill" : "duotone"}
                              />
                              <span className="truncate group-data-[collapsible=icon]:hidden">
                                {item.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 group-data-[collapsible=icon]:hidden">
                              {item.badge !== undefined && (
                                <span
                                  className={cn(
                                    "text-2xs font-bold px-1.5 py-0 h-4 rounded-md inline-flex items-center justify-center",
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
                                const isSubActive = checkSubItemActive(
                                  sub.href,
                                  pathname,
                                  currentSection
                                )

                                return (
                                  <SidebarMenuSubItem key={sub.href}>
                                    <SidebarMenuSubButton
                                      render={
                                        <Link
                                          href={sub.href}
                                          onClick={handleLinkClick}
                                        />
                                      }
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
                      item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={<Link href={item.href} onClick={handleLinkClick} />}
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
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </SidebarMenuButton>

                        {item.badge !== undefined && (
                          <SidebarMenuBadge
                            className={cn(
                              "text-2xs font-bold px-1.5 py-0 h-4.5 rounded-md",
                              isActive
                                ? "bg-primary/20 text-primary"
                                : item.badgeVariant === "destructive"
                                ? "bg-destructive/15 text-destructive"
                                : item.badgeVariant === "warning"
                                ? "bg-accent/15 text-accent"
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
                <a
                  href={marketplaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                />
              }
              tooltip="View Public Marketplace"
              className="h-9 px-3 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ArrowSquareOut size={16} weight="duotone" />
              <span className="group-data-[collapsible=icon]:hidden">
                View Marketplace
              </span>
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
