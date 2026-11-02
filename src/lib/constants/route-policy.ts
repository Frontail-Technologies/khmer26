export function shouldShowMobileBottomNavigation(pathname: string): boolean {
  if (
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/forgot-password") ||
    pathname === "/reset-password" ||
    pathname === "/post-ad" ||
    pathname.startsWith("/post-ad/") ||
    pathname.startsWith("/listing/") ||
    pathname.startsWith("/seller/") ||
    // Profile editing has its own sticky Save bar at the bottom.
    pathname.startsWith("/account/profile")
  ) {
    return false
  }

  if (pathname.startsWith("/messages/") && pathname !== "/messages") {
    return false
  }

  return true
}

export function shouldShowAppHeader(pathname: string): boolean {
  if (
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/forgot-password") ||
    pathname === "/reset-password" ||
    pathname === "/post-ad" ||
    pathname.startsWith("/messages")
  ) {
    return false
  }
  return true
}

export function shouldShowAppFooter(pathname: string): boolean {
  if (
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/forgot-password") ||
    pathname === "/reset-password" ||
    pathname === "/post-ad" ||
    pathname.startsWith("/messages")
  ) {
    return false
  }
  return true
}

/**
 * Screens that draw their own top bar on small screens, so the site header must step aside there.
 * Returns the breakpoint below which the header is hidden, matching that screen's own bar:
 * listing detail (gallery overlay) and seller pages (MobilePageHeader) switch at md,
 * account screens (hub header / AccountMobileAppBar) at lg.
 */
export function ownMobileHeaderBreakpoint(pathname: string): "md" | "lg" | null {
  if (pathname === "/account" || pathname.startsWith("/account/")) return "lg"
  if (pathname.startsWith("/listing/") || pathname.startsWith("/seller/")) return "md"
  return null
}

export function shouldHideAppHeaderOnMobile(pathname: string): boolean {
  return ownMobileHeaderBreakpoint(pathname) !== null
}
