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
    pathname.startsWith("/seller/")
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
    pathname.startsWith("/messages") ||
    pathname.startsWith("/listing/")
  ) {
    return false
  }
  return true
}
