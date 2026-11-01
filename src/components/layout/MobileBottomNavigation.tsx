"use client";

import { useTranslations } from "next-intl"

import { BOTTOM_NAV } from "@/lib/constants/navigation";
import { shouldShowMobileBottomNavigation } from "@/lib/constants/route-policy";
import {
  Camera,
  ChatCircle,
  Compass,
  House,
  User,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavIcon({ name, size = 22, active = false }: { name: string; size?: number; active?: boolean }) {
  const props = { size, "aria-hidden": true, weight: active ? "fill" : "regular" } as const;
  switch (name) {
    case "House":
      return <House {...props} />;
    case "Compass":
      return <Compass {...props} />;
    case "Plus":
      return <Camera {...props} weight="bold" />;
    case "ChatCircle":
      return <ChatCircle {...props} />;
    case "User":
      return <User {...props} />;
    default:
      return null;
  }
}

export function MobileBottomNavigation() {
  const tGenerated = useTranslations("generated")
  const pathname = usePathname();

  if (!shouldShowMobileBottomNavigation(pathname)) {
    return null;
  }

  return (
    <nav
      aria-label={tGenerated("mobileNavigation")}
      style={{ viewTransitionName: "bottom-nav" }}
      className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-full border-t border-border/60 bg-card/85 shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.15)] backdrop-blur-xl backdrop-saturate-150 supports-[not(backdrop-filter:blur(0))]:bg-card md:hidden"
    >
      <div className="flex h-16 items-center px-1">
        {BOTTOM_NAV.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : item.href === "/account"
                ? pathname.startsWith("/account")
                : pathname.startsWith(item.href);
          const isSell = item.accent;

          if (isSell) {
            return (
              <div
                key={item.href}
                className="flex flex-1 items-center justify-center"
              >
                <Link
                  href={item.href}
                  aria-label={tGenerated(item.messageKey)}
                  onClick={tapFeedback}
                  className="pressable -mt-5 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-gradient-to-br from-accent to-[oklch(0.62_0.21_35)] text-accent-foreground shadow-lg shadow-accent/40 ring-4 ring-background"
                >
                  <NavIcon name={item.icon ?? "Plus"} size={24} />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={tapFeedback}
              className={cn(
                "pressable group relative flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-2xs font-medium transition-colors duration-200",
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={tGenerated(item.messageKey)}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                  isActive ? "bg-primary/12 scale-100" : "scale-90 bg-transparent",
                )}
              >
                <NavIcon name={item.icon ?? "House"} size={22} active={isActive} />
              </span>
              <span className="leading-none">{tGenerated(item.messageKey)}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </nav>
  );
}

/** A barely-there haptic tick on supported Android devices, like native tab bars. */
function tapFeedback() {
  try {
    navigator.vibrate?.(8);
  } catch {
    // Not supported (iOS, desktop) or blocked by policy.
  }
}
