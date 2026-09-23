"use client"

import Link from "next/link"
import Image from "next/image"
import { ShieldCheck } from "@phosphor-icons/react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { Badge } from "@/components/ui/badge"

export function AdminMobileNav() {
  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-border/70 bg-card px-3 shadow-2xs md:hidden sticky top-0 z-30 select-none">
      <div className="flex items-center gap-2">
        <SidebarTrigger />

        <Link href="/admin" className="flex items-center gap-1.5 min-w-0">
          <Image
            src="/images/logo.png"
            alt="Khmer26"
            width={90}
            height={22}
            priority
            style={{ width: "auto" }}
            className="h-5 w-auto object-contain"
          />
          <Badge
            variant="secondary"
            className="h-4.5 px-1.5 text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20"
          >
            Admin
          </Badge>
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Link
          href="/admin/settings"
          aria-label="Admin settings"
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
        >
          <ShieldCheck size={18} className="text-primary" />
        </Link>
      </div>
    </header>
  )
}
