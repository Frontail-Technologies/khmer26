"use client"

import Link from "next/link"
import { CaretRight } from "@phosphor-icons/react"
import { ADMIN_SETUP_SECTIONS } from "../navigation/admin-navigation"

/** One page for everything configured occasionally, grouped into tiles. */
export function SetupHub() {
  return (
    <div className="space-y-5">
      {ADMIN_SETUP_SECTIONS.map((section) => (
        <section key={section.id} className="space-y-2">
          <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{section.label}</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {section.links.map(({ title, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="pressable group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-2xs transition-all hover:border-primary/30 hover:shadow-md"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={20} weight="duotone" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{title}</span>
                <CaretRight size={14} weight="bold" className="shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
