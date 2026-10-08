"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ACCOUNT_NAV, MAIN_NAV } from "@/lib/constants/navigation"
import { SITE } from "@/lib/constants/site"
import {
  Heart,
  List,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { shouldShowAppHeader } from "@/lib/constants/route-policy"
import { SearchBar } from "./SearchBar"
import { LanguageSelector } from "./LanguageSelector"
import { ThemeToggle } from "./ThemeToggle"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { useLogout } from "@/features/auth/hooks/use-auth"

export function AppHeader() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useCurrentUser()
  const logout = useLogout()
  // The mobile search bar is open only for the page it was opened on, so it closes on navigation.
  const [mobileSearchPath, setMobileSearchPath] = useState<string | null>(null)
  const mobileSearchOpen = mobileSearchPath === pathname

  if (!shouldShowAppHeader(pathname)) {
    return null
  }

  const displayName = user?.email?.split("@")[0] ?? "Account"
  const initials = displayName.slice(0, 2).toUpperCase()

  const handleSignOut = () => {
    logout.mutate()
  }

  return (
    <header className="sticky top-0 z-50 w-full max-w-full rounded-b-2xl md:rounded-none border-b border-border bg-card shadow-xs overflow-x-clip">
      <div className="mx-auto flex h-14 w-full max-w-350 items-center justify-between gap-2 px-3 sm:px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center min-w-0"
          aria-label={`${SITE.name} — home`}
        >
          <Image
            src="/images/logo.png"
            alt={SITE.name}
            width={120}
            height={32}
            priority
            style={{ width: "auto" }}
            className="h-6 sm:h-7 md:h-8 max-h-8 w-auto object-contain"
          />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center px-2 md:flex">
          <SearchBar className="max-w-2xl" />
        </div>

        <div className="hidden items-center gap-1.5 md:flex shrink-0">
          <Link
            href="/account/favorites"
            aria-label="Saved listings"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <Heart size={20} aria-hidden="true" />
          </Link>

          <LanguageSelector />
          <ThemeToggle />

          <Separator orientation="vertical" className="mx-1 h-5" />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                aria-label="Account menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs truncate">{user?.email ?? "My Account"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ACCOUNT_NAV.slice(0, 5).map((item) => (
                  <DropdownMenuItem key={item.href}>
                    <Link href={item.href} className="flex w-full">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleSignOut}
                  disabled={logout.isPending}
                >
                  {logout.isPending ? "Signing out..." : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                href="/login"
                className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors px-2.5 py-1.5 rounded-md hover:bg-muted"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors px-2.5 py-1.5 rounded-md hover:bg-muted"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <Button
          size="sm"
          className="hidden shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 md:flex font-bold shadow-xs h-9 px-3.5 rounded-lg"
          render={
            <Link href="/post-ad" className="flex items-center gap-1.5">
              <Plus size={16} aria-hidden="true" weight="bold" />
              Post Ad
            </Link>
          }
        />

        <div className="flex items-center gap-0.5 sm:gap-1 md:hidden shrink-0">
          <LanguageSelector />
          <ThemeToggle />

          <button
            type="button"
            aria-label="Search"
            aria-expanded={mobileSearchOpen}
            onClick={() => setMobileSearchPath(mobileSearchOpen ? null : pathname)}
            className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
          >
            <MagnifyingGlass size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
          </button>

          <Sheet>
            <SheetTrigger
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
              aria-label="Open navigation menu"
            >
              <List size={20} className="sm:w-5.5 sm:h-5.5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b border-border px-4 py-4">
                <SheetTitle className="flex items-center text-left">
                  <Image
                    src="/images/logo.png"
                    alt={SITE.name}
                    width={110}
                    height={30}
                    style={{ width: "auto" }}
                    className="h-7 w-auto object-contain"
                  />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col py-2">
                {MAIN_NAV.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
                <Separator className="my-2" />
                {isAuthenticated ? (
                  <>
                    {ACCOUNT_NAV.slice(0, 5).map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Separator className="my-2" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={logout.isPending}
                      className="flex items-center px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-muted text-left w-full disabled:opacity-50"
                    >
                      {logout.isPending ? "Signing out..." : "Sign Out"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted"
                    >
                      Create an account
                    </Link>
                    <Separator className="my-2" />
                    {ACCOUNT_NAV.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </>
                )}
                <Separator className="my-2" />
                <div className="px-4 pt-2">
                  <Button
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                    render={
                      <Link href="/post-ad" className="flex w-full items-center justify-center gap-2">
                        <Plus size={16} aria-hidden="true" weight="bold" />
                        Post Ad
                      </Link>
                    }
                  />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-border px-3 py-2 sm:px-4 md:hidden">
          <SearchBar />
        </div>
      )}
    </header>
  )
}
