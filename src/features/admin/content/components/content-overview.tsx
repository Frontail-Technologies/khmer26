"use client"

import Link from "next/link"
import {
  HouseLine,
  Image as ImageIcon,
  Sparkle,
  ArrowRight,
  ClockCounterClockwise,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"

interface ContentModuleCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  stats: string
  variantColor: string
}

const CONTENT_MODULES: ContentModuleCard[] = [
  {
    title: "Homepage Layout & Discovery",
    description: "Curate marketplace discovery sections, hero sliders, categories, and promotional rows.",
    href: "/admin/content/homepage",
    icon: <HouseLine size={20} weight="duotone" />,
    stats: "6 Active Sections",
    variantColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    title: "Promotional Banners",
    description: "Schedule and manage marketing banners across hero slots, category headers, and sidebars.",
    href: "/admin/content/banners",
    icon: <ImageIcon size={20} weight="duotone" />,
    stats: "3 Active Banners • 48.9k Views",
    variantColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    title: "Featured & Sponsored Content",
    description: "Prioritize top sponsored listings, verified merchant collections, and priority dealer spotlights.",
    href: "/admin/content/featured",
    icon: <Sparkle size={20} weight="duotone" />,
    stats: "3 Curated Lists",
    variantColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
]

export function ContentOverview() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CONTENT_MODULES.map((item) => (
          <Link key={item.href} href={item.href} className="block group">
            <Card className="p-4 sm:p-5 bg-card border-0 rounded-xl hover:bg-muted/10 transition-all shadow-2xs hover:shadow-xs h-full flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className={`size-10 rounded-lg flex items-center justify-center border ${item.variantColor}`}>
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground bg-muted/70 border border-border/50 px-2.5 py-0.5 rounded-md">
                    {item.stats}
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    {item.title}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
                <span>Manage Section</span>
                <ArrowRight size={13} weight="bold" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-card border-0 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ClockCounterClockwise size={15} weight="bold" />
            Recent Content Updates
          </span>
          <span className="text-xs text-muted-foreground font-medium">Logged with admin signatures</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60 flex items-center justify-between">
            <span className="text-foreground font-semibold">Khmer New Year Banner Scheduled</span>
            <span className="text-muted-foreground text-xs">Today at 10:15 • By Chea Rithy</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60 flex items-center justify-between">
            <span className="text-foreground font-semibold">Featured Listings Priority Reordered</span>
            <span className="text-muted-foreground text-xs">Yesterday • By System Automation</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60 flex items-center justify-between">
            <span className="text-foreground font-semibold">Community Safety Policy Updated</span>
            <span className="text-muted-foreground text-xs">2026-03-01 • By Trust & Safety</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
