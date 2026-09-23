"use client"

import Link from "next/link"
import { House, Compass } from "@phosphor-icons/react"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"

function NotFoundIllustration() {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-4/3 mx-auto flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent rounded-full blur-2xl -z-10" />
      <svg
        viewBox="0 0 320 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <circle cx="160" cy="120" r="90" className="stroke-muted-foreground/15" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="160" cy="120" r="60" className="stroke-muted-foreground/20" strokeWidth="1.5" />
        <circle cx="160" cy="120" r="30" className="stroke-muted-foreground/25" strokeWidth="1.5" strokeDasharray="3 3" />

        <g className="animate-pulse">
          <circle cx="95" cy="85" r="4" className="fill-primary/40" />
          <circle cx="225" cy="75" r="3" className="fill-primary/50" />
          <circle cx="240" cy="155" r="4" className="fill-primary/30" />
          <circle cx="75" cy="145" r="3" className="fill-primary/40" />
        </g>

        <path
          d="M60 190C100 175 220 175 260 190"
          className="stroke-muted-foreground/20"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <g transform="translate(100, 50)">
          <rect
            x="0"
            y="0"
            width="120"
            height="110"
            rx="16"
            className="fill-card stroke-border"
            strokeWidth="1.5"
          />
          <rect
            x="10"
            y="10"
            width="100"
            height="50"
            rx="10"
            className="fill-muted/50"
          />
          <circle
            cx="60"
            cy="35"
            r="16"
            className="fill-background stroke-primary/30"
            strokeWidth="1.5"
          />
          <path
            d="M54 35L66 35M60 29L60 41"
            className="stroke-primary"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <rect x="14" y="70" width="60" height="6" rx="3" className="fill-foreground/80" />
          <rect x="14" y="82" width="92" height="5" rx="2.5" className="fill-muted-foreground/40" />
          <rect x="14" y="91" width="45" height="5" rx="2.5" className="fill-muted-foreground/30" />
        </g>

        <g transform="translate(180, 115)">
          <circle cx="32" cy="32" r="28" className="fill-background stroke-primary" strokeWidth="3" />
          <circle cx="32" cy="32" r="22" className="fill-primary/10" />
          <path
            d="M23 23L41 41M41 23L23 41"
            className="stroke-primary"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M52 52L68 68"
            className="stroke-primary"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        <g transform="translate(70, 70)">
          <path
            d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 26 16 38 16 38C16 38 0 26 0 16Z"
            className="fill-primary stroke-primary-foreground/20"
            strokeWidth="1.5"
          />
          <circle cx="16" cy="15" r="5" className="fill-primary-foreground" />
        </g>
      </svg>
    </div>
  )
}

export default function NotFound() {
  return (
    <Container size="narrow" className="py-12 sm:py-20">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
        <NotFoundIllustration />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono tracking-wider uppercase">
            Error 404
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The page or listing you are looking for has been removed, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full pt-1">
          <Button
            size="sm"
            className="h-9 px-4 text-xs font-semibold gap-1.5"
            render={
              <Link href="/">
                <House size={15} weight="bold" />
                Go to Homepage
              </Link>
            }
          />
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 text-xs font-semibold gap-1.5"
            render={
              <Link href="/categories">
                <Compass size={15} weight="bold" />
                Browse Categories
              </Link>
            }
          />
        </div>

        <div className="pt-6 border-t border-border/70 w-full">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
            Looking for something specific?
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Vehicles", href: "/category/vehicles" },
              { label: "Properties", href: "/category/properties" },
              { label: "Electronics", href: "/category/electronics" },
              { label: "Search Ads", href: "/search" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs px-2.5 py-1 rounded-md bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
