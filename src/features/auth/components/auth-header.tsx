import { cn } from "@/lib/utils"

interface AuthHeaderProps {
  eyebrow: string
  title: string
  subtitle: string
  align?: "left" | "center"
  className?: string
}

export function AuthHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: AuthHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-1.5 mb-6",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-primary">
        {eyebrow}
      </span>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {subtitle}
      </p>
    </div>
  )
}
