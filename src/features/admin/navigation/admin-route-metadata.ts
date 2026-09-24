export interface AdminRouteInfo {
  title: string
  subtitle: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
}

export const ADMIN_ROUTE_METADATA: Record<string, AdminRouteInfo> = {
  "/admin": {
    title: "Dashboard Overview",
    subtitle: "Marketplace activity, listings, and moderation summary.",
  },
  "/admin/listings": {
    title: "Listings",
    subtitle: "Review, moderate and manage marketplace listings.",
    badge: "14 Pending",
    badgeVariant: "secondary",
  },
  "/admin/verifications": {
    title: "Seller Verifications",
    subtitle: "Review identity and business verification requests.",
    badge: "5 Pending",
    badgeVariant: "secondary",
  },
  "/admin/reports": {
    title: "Reports",
    subtitle: "Review marketplace reports and community moderation cases.",
    badge: "8 Open",
    badgeVariant: "destructive",
  },
  "/admin/reports/reasons": {
    title: "Report Reasons",
    subtitle: "Manage reasons and categories available for user reporting.",
  },
  "/admin/users": {
    title: "Users & Sellers",
    subtitle: "Manage marketplace accounts, profiles, and seller activity.",
  },
  "/admin/categories": {
    title: "Categories",
    subtitle: "Manage marketplace categories, subcategories, and listing fields.",
  },
  "/admin/reviews": {
    title: "Reviews",
    subtitle: "Monitor seller reviews, customer ratings, and feedback.",
  },
  "/admin/promotions": {
    title: "Promotions",
    subtitle: "Manage featured ads, homepage spotlights, and promotional campaigns.",
  },
  "/admin/subscriptions": {
    title: "Subscriptions",
    subtitle: "Manage dealer packages, seller plans, and membership tiers.",
  },
  "/admin/payments": {
    title: "Payments",
    subtitle: "Review marketplace transactions, payment gateways, and settlements.",
  },
  "/admin/notifications": {
    title: "Notifications",
    subtitle: "Broadcast system alerts, push notifications, and admin notices.",
  },
  "/admin/reported-chats": {
    title: "Reported Chats",
    subtitle: "Investigate flagged buyer-seller conversations and scam alerts.",
  },
  "/admin/locations": {
    title: "Locations",
    subtitle: "Manage Cambodia administrative divisions, provinces, and districts.",
  },
  "/admin/roles": {
    title: "Admin Roles",
    subtitle: "Configure staff permissions, RBAC policies, and administrative roles.",
  },
  "/admin/settings": {
    title: "Settings",
    subtitle: "Platform configuration, security policies, and localization preferences.",
  },
  "/admin/audit-log": {
    title: "Audit Log",
    subtitle: "Comprehensive chronological ledger of administrative operations.",
  },
  "/admin/content": {
    title: "Content Management",
    subtitle: "Manage homepage discovery blocks, promotional banners, and featured items.",
  },
  "/admin/content/homepage": {
    title: "Homepage Content",
    subtitle: "Curate featured collections, slider banners, and discovery blocks.",
  },
  "/admin/content/banners": {
    title: "Banners",
    subtitle: "Schedule and manage marketing promotional banners.",
  },
  "/admin/content/featured": {
    title: "Featured Content",
    subtitle: "Select and prioritize sponsored listings and categories.",
  },
}

export function getAdminRouteInfo(pathname: string): AdminRouteInfo {
  if (ADMIN_ROUTE_METADATA[pathname]) {
    return ADMIN_ROUTE_METADATA[pathname]
  }

  if (pathname.startsWith("/admin/verifications/") && pathname !== "/admin/verifications") {
    return {
      title: "Seller Verification",
      subtitle: "Review submitted seller verification information.",
    }
  }

  if (pathname.startsWith("/admin/listings/") && pathname !== "/admin/listings") {
    return {
      title: "Listing Review",
      subtitle: "Review marketplace listing content and moderation status.",
    }
  }

  if (pathname.startsWith("/admin/users/") && pathname !== "/admin/users") {
    return {
      title: "User Details",
      subtitle: "Review user account profile and moderation history.",
    }
  }

  if (pathname.startsWith("/admin/reports/") && pathname !== "/admin/reports" && pathname !== "/admin/reports/reasons") {
    return {
      title: "Report Review",
      subtitle: "Review reported content and resolution options.",
    }
  }

  if (pathname.startsWith("/admin/payments/") && pathname !== "/admin/payments") {
    return {
      title: "Payment Details",
      subtitle: "Review transaction details and payment receipt.",
    }
  }

  const segments = pathname.replace("/admin/", "").split("/")
  const last = segments[segments.length - 1] || "Overview"
  const formatted = last
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return {
    title: formatted,
    subtitle: "Khmer26 Administration Portal",
  }
}
