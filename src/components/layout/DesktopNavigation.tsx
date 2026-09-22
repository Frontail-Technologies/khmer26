import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { MAIN_NAV } from "@/lib/constants/navigation"

interface DesktopNavigationProps {
  className?: string
}

export function DesktopNavigation({ className }: DesktopNavigationProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        "hidden border-b border-border bg-card md:block",
        className,
      )}
    >
      <div className="mx-auto flex max-w-350 items-center gap-1 px-3 sm:px-4 md:px-6 lg:px-8">
        {MAIN_NAV.map((link, i) => (
          <div key={link.href} className="flex items-center">
            {i > 0 && (
              <Separator orientation="vertical" className="mx-1 h-4" />
            )}
            <Link
              href={link.href}
              className="flex items-center px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  )
}
