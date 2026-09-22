"use client"

import { Separator } from "@/components/ui/separator"
import { FOOTER_NAV } from "@/lib/constants/navigation"
import { SITE } from "@/lib/constants/site"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppFooter() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  const isFocusedFlowPage =
    pathname === "/post-ad" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/forgot-password") ||
    pathname === "/reset-password" ||
    pathname.startsWith("/messages")

  if (isFocusedFlowPage) {
    return null
  }

  return (
    <footer className="mt-auto bg-card">
      <div className="border-t border-border pt-6 sm:pt-8 pb-8 sm:pb-10">
        <div className="mx-auto max-w-350 px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-5 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-block" aria-label={`${SITE.name} home`}>
                <Image
                  src="/images/logo.png"
                  alt={SITE.name}
                  width={120}
                  height={30}
                  style={{ width: "auto" }}
                  className="h-7 w-auto object-contain"
                />
              </Link>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {SITE.tagline}. Buy and sell anything in Cambodia.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Marketplace
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {FOOTER_NAV.marketplace.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Account
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {FOOTER_NAV.account.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Help
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {FOOTER_NAV.help.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Legal
              </h3>
              <ul className="mt-2.5 space-y-1.5">
                {FOOTER_NAV.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-5 sm:my-8" />

          <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
            <p>© {currentYear} {SITE.name}. All rights reserved.</p>
            <p className="hidden sm:block">{SITE.tagline}</p>
          </div>
        </div>

        <div className="h-14 md:hidden" aria-hidden="true" />
      </div>
    </footer>
  )
}
