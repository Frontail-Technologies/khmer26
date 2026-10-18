import { Separator } from "@/components/ui/separator"

interface AuthDividerProps {
  label?: string
}

export function AuthDivider({ label = "OR CONTINUE WITH" }: AuthDividerProps) {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full" />
      </div>
      <div className="relative flex justify-center text-2xs sm:text-xxs font-bold uppercase tracking-wider text-muted-foreground">
        <span className="bg-card px-3">{label}</span>
      </div>
    </div>
  )
}
