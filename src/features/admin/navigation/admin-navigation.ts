import type { ComponentType } from "react"
import type { IconProps } from "@phosphor-icons/react"
import {
  Bell,
  ChartPieSlice,
  Chats,
  ChatTeardropText,
  ClockCounterClockwise,
  CreditCard,
  Crown,
  FileText,
  Flag,
  Gear,
  GearSix,
  Headset,
  House,
  Image as ImageIcon,
  MapPin,
  Megaphone,
  ShieldCheck,
  SealCheck,
  Sliders,
  Sparkle,
  Star,
  Storefront,
  Tray,
  TreeStructure,
  UsersThree,
  WarningOctagon,
  Lifebuoy,
} from "@phosphor-icons/react"

/** Keys of the live "waiting for you" counters (see useAdminQueueCounts). */
export type AdminCountKey = "queue" | "listings" | "verifications" | "reports"

export interface AdminNavSubItem {
  title: string
  href: string
  badge?: number | string
}

export interface AdminNavItem {
  title: string
  href: string
  icon: ComponentType<IconProps>
  badge?: number | string
  badgeVariant?: "default" | "destructive" | "warning" | "outline"
  /** Live count shown as a badge. */
  countKey?: AdminCountKey
  /** Extra path prefixes that should highlight this item (e.g. setup screens under "Setup"). */
  matches?: string[]
  subItems?: AdminNavSubItem[]
}

export interface AdminNavGroup {
  id: string
  label: string
  items: AdminNavItem[]
}

export interface AdminSetupLink {
  title: string
  href: string
  icon: ComponentType<IconProps>
}

export interface AdminSetupSection {
  id: string
  label: string
  links: AdminSetupLink[]
}

/**
 * Screens that are configured occasionally. They live on the Setup page (and in search) instead of
 * crowding the daily menu.
 */
const SETUP_SECTIONS_WITH_INTERNAL_PATHS: AdminSetupSection[] = [
  {
    id: "catalog",
    label: "Catalog",
    links: [
      { title: "Categories", href: "/admin/categories", icon: TreeStructure },
      { title: "Listing Fields", href: "/admin/listing-fields", icon: Sliders },
      { title: "Locations", href: "/admin/locations", icon: MapPin },
      { title: "Report Reasons", href: "/admin/reports/reasons", icon: WarningOctagon },
    ],
  },
  {
    id: "content",
    label: "Content",
    links: [
      { title: "Homepage", href: "/admin/content/homepage", icon: House },
      { title: "Featured Sections", href: "/admin/content/featured", icon: Sparkle },
      { title: "Banners", href: "/admin/content/banners", icon: ImageIcon },
      { title: "Safety Tips", href: "/admin/content/tips", icon: Lifebuoy },
      { title: "Policy Pages", href: "/admin/content/pages", icon: FileText },
      { title: "Review Keywords", href: "/admin/content/keywords", icon: ChatTeardropText },
    ],
  },
  {
    id: "community",
    label: "Community",
    links: [
      { title: "Reviews", href: "/admin/reviews", icon: Star },
      { title: "Reported Chats", href: "/admin/reported-chats", icon: Flag },
      { title: "Broadcasts", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    id: "system",
    label: "System",
    links: [
      { title: "Platform Settings", href: "/admin/settings", icon: Gear },
      { title: "Roles & Staff", href: "/admin/roles", icon: ShieldCheck },
      { title: "Audit Log", href: "/admin/audit-log", icon: ClockCounterClockwise },
    ],
  },
]

const ADMIN_NAV_CONFIG_WITH_INTERNAL_PATHS: AdminNavGroup[] = [
  {
    id: "work",
    label: "Work",
    items: [
      { title: "Queue", href: "/admin/queue", icon: Tray, countKey: "queue" },
      { title: "Dashboard", href: "/admin", icon: ChartPieSlice },
      { title: "Listings", href: "/admin/listings", icon: Storefront, countKey: "listings" },
      { title: "Users", href: "/admin/users", icon: UsersThree },
      { title: "Verifications", href: "/admin/verifications", icon: SealCheck, countKey: "verifications" },
      { title: "Reports", href: "/admin/reports", icon: Flag, countKey: "reports", matches: ["/admin/reports/"] },
      { title: "Messages", href: "/admin/chats", icon: Chats },
      { title: "Support", href: "/admin/support", icon: Headset },
    ],
  },
  {
    id: "money",
    label: "Money",
    items: [
      { title: "Payments", href: "/admin/payments", icon: CreditCard },
      { title: "Subscriptions", href: "/admin/subscriptions", icon: Crown },
      { title: "Promotions", href: "/admin/promotions", icon: Megaphone },
    ],
  },
  {
    id: "setup",
    label: "System",
    items: [
      {
        title: "Setup",
        href: "/admin/setup",
        icon: GearSix,
        matches: SETUP_SECTIONS_WITH_INTERNAL_PATHS.flatMap((section) => section.links.map((link) => link.href)),
      },
    ],
  },
]

/** Admin pages are served from the admin host root, so "/admin/x" is linked as "/x". */
export function toAdminHostnamePath(href: string): string {
  if (href === "/admin") return "/"
  return href.startsWith("/admin/") ? href.slice("/admin".length) : href
}

export const ADMIN_NAV_CONFIG: AdminNavGroup[] = ADMIN_NAV_CONFIG_WITH_INTERNAL_PATHS.map((group) => ({
  ...group,
  items: group.items.map((item) => ({
    ...item,
    href: toAdminHostnamePath(item.href),
    matches: item.matches?.map(toAdminHostnamePath),
    subItems: item.subItems?.map((subItem) => ({ ...subItem, href: toAdminHostnamePath(subItem.href) })),
  })),
}))

export const ADMIN_SETUP_SECTIONS: AdminSetupSection[] = SETUP_SECTIONS_WITH_INTERNAL_PATHS.map((section) => ({
  ...section,
  links: section.links.map((link) => ({ ...link, href: toAdminHostnamePath(link.href) })),
}))

/** Every destination (menu + setup), used by search and by route coverage tests. */
export const ADMIN_DESTINATIONS: Array<{ title: string; href: string; icon: ComponentType<IconProps>; group: string }> = [
  ...ADMIN_NAV_CONFIG.flatMap((group) => group.items.map((item) => ({ title: item.title, href: item.href, icon: item.icon, group: group.label }))),
  ...ADMIN_SETUP_SECTIONS.flatMap((section) => section.links.map((link) => ({ ...link, group: section.label }))),
]

/** Normalise a pathname from either host form ("/admin/x" or "/x"). */
export function normaliseAdminPath(pathname: string): string {
  const path = pathname.replace(/^\/admin(?=\/|$)/, "")
  return path === "" ? "/" : path
}

export function isNavItemActive(item: Pick<AdminNavItem, "href" | "matches">, pathname: string): boolean {
  const path = normaliseAdminPath(pathname)
  if (item.href === "/") return path === "/"
  if (path === item.href || path.startsWith(`${item.href}/`)) {
    // /reports/reasons belongs to Setup, not Reports.
    return !(item.href === "/reports" && path.startsWith("/reports/reasons"))
  }
  return (item.matches ?? []).some((prefix) =>
    prefix.endsWith("/") ? path.startsWith(prefix) && !path.startsWith("/reports/reasons") : path === prefix || path.startsWith(`${prefix}/`)
  )
}

