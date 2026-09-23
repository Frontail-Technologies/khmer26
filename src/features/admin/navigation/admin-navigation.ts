import type { ComponentType } from "react"
import type { IconProps } from "@phosphor-icons/react"
import {
  SquaresFour,
  ListBullets,
  WarningCircle,
  SealCheck,
  Users,
  Star,
  House,
  Image,
  Sparkle,
  Megaphone,
  Crown,
  CreditCard,
  Bell,
  ChatCircle,
  MapPin,
  ShieldCheck,
  Gear,
  ClockCounterClockwise,
} from "@phosphor-icons/react"

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
  subItems?: AdminNavSubItem[]
}

export interface AdminNavGroup {
  id: string
  label: string
  items: AdminNavItem[]
}

export const ADMIN_NAV_CONFIG: AdminNavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: SquaresFour,
      },
    ],
  },
  {
    id: "marketplace",
    label: "Marketplace",
    items: [
      {
        title: "Listings",
        href: "/admin/listings",
        icon: ListBullets,
        badge: 14,
        subItems: [
          {
            title: "All Listings",
            href: "/admin/listings",
          },
          {
            title: "Categories",
            href: "/admin/categories",
          },
          {
            title: "Listing Fields",
            href: "/admin/listing-fields",
          },
        ],
      },
      {
        title: "Reports",
        href: "/admin/reports",
        icon: WarningCircle,
        badge: 8,
        badgeVariant: "destructive",
      },
      {
        title: "Verifications",
        href: "/admin/verifications",
        icon: SealCheck,
        badge: 5,
        badgeVariant: "warning",
      },
    ],
  },
  {
    id: "users",
    label: "Users",
    items: [
      {
        title: "Users & Sellers",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Reviews",
        href: "/admin/reviews",
        icon: Star,
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    items: [
      {
        title: "Homepage",
        href: "/admin/content/homepage",
        icon: House,
      },
      {
        title: "Banners",
        href: "/admin/content/banners",
        icon: Image,
      },
      {
        title: "Featured Content",
        href: "/admin/content/featured",
        icon: Sparkle,
      },
    ],
  },
  {
    id: "monetization",
    label: "Monetization",
    items: [
      {
        title: "Promotions",
        href: "/admin/promotions",
        icon: Megaphone,
      },
      {
        title: "Subscriptions",
        href: "/admin/subscriptions",
        icon: Crown,
      },
      {
        title: "Payments",
        href: "/admin/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    items: [
      {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
      },
      {
        title: "Reported Chats",
        href: "/admin/reported-chats",
        icon: ChatCircle,
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      {
        title: "Locations",
        href: "/admin/locations",
        icon: MapPin,
      },
      {
        title: "Admin Roles",
        href: "/admin/roles",
        icon: ShieldCheck,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Gear,
      },
      {
        title: "Audit Log",
        href: "/admin/audit-log",
        icon: ClockCounterClockwise,
      },
    ],
  },
]
