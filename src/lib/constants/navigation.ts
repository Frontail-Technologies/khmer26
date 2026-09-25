export interface NavLink {
  label: string
  href: string
  icon?: string
  authOnly?: boolean
  accent?: boolean
}

export const MAIN_NAV: NavLink[] = [
  { label: "Home", href: "/", icon: "House" },
  { label: "All Categories", href: "/categories", icon: "SquaresFour" },
  { label: "Pricing", href: "/pricing", icon: "CurrencyDollar" },
]

export const BOTTOM_NAV: NavLink[] = [
  { label: "Home", href: "/", icon: "House" },
  { label: "Explore", href: "/search", icon: "Compass" },
  { label: "Sell", href: "/post-ad", icon: "Plus", accent: true },
  { label: "Messages", href: "/messages", icon: "ChatCircle", authOnly: true },
  { label: "Profile", href: "/account/profile", icon: "User", authOnly: true },
]

export const ACCOUNT_NAV: NavLink[] = [
  { label: "Dashboard", href: "/account", icon: "LayoutDashboard" },
  { label: "My Listings", href: "/account/listings", icon: "ListBullets" },
  { label: "Favorites", href: "/account/favorites", icon: "Heart" },
  { label: "Messages", href: "/messages", icon: "ChatCircle" },
  { label: "Subscription", href: "/account/subscription", icon: "Star" },
  { label: "Payments", href: "/account/payments", icon: "CreditCard" },
  { label: "Profile", href: "/account/profile", icon: "UserCircle" },
  { label: "Settings", href: "/account/settings", icon: "Gear" },
]

export const FOOTER_NAV = {
  marketplace: [
    { label: "All Categories", href: "/categories" },
    { label: "Search", href: "/search" },
    { label: "Pricing", href: "/pricing" },
    { label: "Post an Ad", href: "/post-ad" },
  ],
  account: [
    { label: "Sign In", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "My Account", href: "/account" },
    { label: "My Listings", href: "/account/listings" },
  ],
  help: [
    { label: "Posting Rules", href: "/posting-rules" },
    { label: "Contact Us", href: "/contact" },
    { label: "Send Feedback", href: "/contact?type=feedback" },
  ],
  legal: [
    { label: "Terms of Service", href: "/posting-rules" },
    { label: "Privacy Policy", href: "/posting-rules" },
    { label: "Cookie Policy", href: "/posting-rules" },
  ],
} as const
