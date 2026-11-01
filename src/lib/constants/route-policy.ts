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

/** Mobile-only: listing detail starts directly with the gallery (Back/Save/Share overlay it). */
export function shouldHideAppHeaderOnMobile(pathname: string): boolean {
  // Account pages bring their own app bar (hub title, or back + title on sub-pages).
  return pathname.startsWith("/listing/") || pathname === "/account" || pathname.startsWith("/account/")
}
