import Link from "next/link"
import { CheckCircle } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"

interface AuthSuccessStateProps {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function AuthSuccessState({
  title = "Password updated",
  description = "Your password has been changed successfully.",
  actionLabel = "Back to Sign In",
  actionHref = "/login",
}: AuthSuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle size={36} weight="fill" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
          {description}
        </p>
      </div>

      <div className="pt-2 w-full">
        <Button
          className="w-full h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-lg shadow-sm"
          render={
            <Link href={actionHref} className="flex items-center justify-center w-full">
              {actionLabel}
            </Link>
          }
        />
      </div>
    </div>
  )
}
