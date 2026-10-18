import type { GeneratedMessageKey } from "@/i18n/message-types"

export interface NavLink {
  label: string
  messageKey: GeneratedMessageKey
  href: string
  icon?: string
  authOnly?: boolean
  accent?: boolean
}

export const MAIN_NAV: NavLink[] = [
  { label: "Home", messageKey: "home", href: "/", icon: "House" },
  { label: "All Categories", messageKey: "allCategories", href: "/categories", icon: "SquaresFour" },
  { label: "Pricing", messageKey: "pricing", href: "/pricing", icon: "CurrencyDollar" },
]

export const BOTTOM_NAV: NavLink[] = [
  { label: "Home", messageKey: "home", href: "/", icon: "House" },
  { label: "Explore", messageKey: "explore", href: "/search", icon: "Compass" },
  { label: "Sell", messageKey: "sell", href: "/post-ad", icon: "Plus", accent: true },
  { label: "Messages", messageKey: "messages_f1702b", href: "/messages", icon: "ChatCircle", authOnly: true },
  { label: "Profile", messageKey: "profile", href: "/account/profile", icon: "User", authOnly: true },
]

export const ACCOUNT_NAV: NavLink[] = [
  { label: "Dashboard", messageKey: "dashboard", href: "/account", icon: "LayoutDashboard" },
  { label: "My Listings", messageKey: "myListings", href: "/account/listings", icon: "ListBullets" },
  { label: "Favorites", messageKey: "favorites", href: "/account/favorites", icon: "Heart" },
  { label: "Messages", messageKey: "messages_f1702b", href: "/messages", icon: "ChatCircle" },
  { label: "Subscription", messageKey: "subscription", href: "/account/subscription", icon: "Star" },
  { label: "Payments", messageKey: "payments", href: "/account/payments", icon: "CreditCard" },
  { label: "Profile", messageKey: "profile", href: "/account/profile", icon: "UserCircle" },
  { label: "Settings", messageKey: "settings", href: "/account/settings", icon: "Gear" },
]

export const FOOTER_NAV = {
  marketplace: [
    { label: "All Categories", messageKey: "allCategories", href: "/categories" },
    { label: "Search", messageKey: "search", href: "/search" },
    { label: "Pricing", messageKey: "pricing", href: "/pricing" },
    { label: "Post an Ad", messageKey: "postAnAd", href: "/post-ad" },
  ],
  account: [
    { label: "Sign In", messageKey: "signIn_f8492c", href: "/login" },
    { label: "Register", messageKey: "register", href: "/register" },
    { label: "My Account", messageKey: "myAccount", href: "/account" },
    { label: "My Listings", messageKey: "myListings", href: "/account/listings" },
  ],
  help: [
    { label: "Posting Rules", messageKey: "postingRules", href: "/posting-rules" },
    { label: "Contact Us", messageKey: "contactUs", href: "/contact" },
    { label: "Send Feedback", messageKey: "sendFeedback", href: "/contact?type=feedback" },
  ],
  legal: [
    { label: "Terms of Service", messageKey: "termsOfService", href: "/terms" },
    { label: "Privacy Policy", messageKey: "privacyPolicy", href: "/privacy" },
    { label: "Cookie Policy", messageKey: "cookiePolicy", href: "/privacy#cookies" },
  ],
} as const
