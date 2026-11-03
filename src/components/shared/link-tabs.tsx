import Link from "next/link"
import { cn } from "@/lib/utils"

export interface LinkTabItem {
  href: string
  label: string
  active: boolean
  count?: number
}

interface LinkTabsProps {
  items: LinkTabItem[]
  label: string
  /** Stretch tabs to equal widths (2–3 tabs on a phone) instead of hugging their labels. */
  fill?: boolean
  className?: string
}

/**
 * Underlined tab bar where each tab is its own page (followers/following, search groups).
 * Matches the line style of <TabsList variant="line"> used by in-page tabs.
 */
export function LinkTabs({ items, label, fill = true, className }: LinkTabsProps) {
  return (
    <nav
      aria-label={label}
      className={cn("flex overflow-x-auto border-b border-border/70 [scrollbar-width:none]", !fill && "gap-6", className)}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          replace
          scroll={false}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "relative inline-flex h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap text-sm font-semibold transition-colors",
            fill && "flex-1 px-2",
            item.active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:transition-colors",
            item.active ? "after:bg-primary" : "after:bg-transparent"
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span
              className={cn(
                "rounded-full px-1.5 py-px text-2xs font-bold tabular-nums",
                item.active ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              {item.count}
            </span>
          )}
        </Link>
      ))}
    </nav>
  )
}
