import Image from "next/image"
import { cn } from "@/lib/utils"
import { SITE } from "@/lib/constants/site"

interface BrandLogoProps {
  /** Sets the height (the width follows the logo's proportions). */
  className?: string
  priority?: boolean
}

/** The offerupkh logo. The dark-mode file has lighter lettering so it stays readable on dark backgrounds. */
export function BrandLogo({ className = "h-9", priority }: BrandLogoProps) {
  const shared = { alt: SITE.name, width: 1400, height: 495, priority, style: { width: "auto" } as const }
  return (
    <>
      <Image {...shared} src="/images/logo.png" className={cn("w-auto object-contain dark:hidden", className)} />
      <Image {...shared} src="/images/logo-dark.png" className={cn("hidden w-auto object-contain dark:block", className)} />
    </>
  )
}
