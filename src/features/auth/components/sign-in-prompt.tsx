"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useSyncExternalStore } from "react"
import { SignIn, UserCirclePlus } from "@phosphor-icons/react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { isProtectedPath } from "@/lib/constants/route-policy"
import { useCurrentUser } from "../hooks/use-current-user"
import {
  closeSignInPrompt,
  getSignInPromptReturnTo,
  openSignInPrompt,
  subscribeSignInPrompt,
} from "../lib/sign-in-prompt-store"

/**
 * "Sign in to continue" sheet. Guests tapping any in-app link to a signed-in area (Sell, Messages,
 * Profile, account links…) get this prompt in place instead of a jarring redirect to /login, and keep
 * their place on the current page. Hooks like useRequireAuth open it for protected actions too.
 */
export function SignInPrompt() {
  const t = useTranslations("authPrompt")
  const returnTo = useSyncExternalStore(subscribeSignInPrompt, getSignInPromptReturnTo, () => null)
  const { isAuthenticated, isLoading } = useCurrentUser()
  const pathname = usePathname()
  const signedOut = !isLoading && !isAuthenticated

  // A route change (back button, sign-in finished) always dismisses it.
  useEffect(() => closeSignInPrompt(), [pathname])
  useEffect(() => {
    if (isAuthenticated) closeSignInPrompt()
  }, [isAuthenticated])

  // Intercept guest taps on links into protected areas, before Next's <Link> navigates.
  useEffect(() => {
    if (!signedOut) return
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest?.("a[href]")
      if (!(anchor instanceof HTMLAnchorElement) || (anchor.target && anchor.target !== "_self")) return
      if (anchor.hasAttribute("download")) return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin || !isProtectedPath(url.pathname)) return
      event.preventDefault()
      event.stopPropagation()
      openSignInPrompt(url.pathname + url.search)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [signedOut])

  const next = encodeURIComponent(returnTo ?? "/")

  return (
    <Dialog open={returnTo !== null} onOpenChange={(open) => !open && closeSignInPrompt()}>
      <DialogContent
        className="gap-5 max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:max-w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-sm:data-open:slide-in-from-bottom-8 max-sm:data-closed:slide-out-to-bottom-8 max-sm:data-open:zoom-in-100 max-sm:data-closed:zoom-out-100"
      >
        <div className="mx-auto -mt-2 h-1 w-10 rounded-full bg-muted-foreground/25 sm:hidden" aria-hidden="true" />
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SignIn size={28} weight="duotone" aria-hidden="true" />
          </span>
          <DialogTitle className="text-lg font-bold">{t("title")}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">{t("body")}</DialogDescription>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href={`/login?next=${next}`}
            onClick={() => closeSignInPrompt()}
            className={cn(buttonVariants({ size: "lg" }), "h-11 w-full font-semibold")}
          >
            <SignIn size={18} weight="bold" aria-hidden="true" />
            {t("signIn")}
          </Link>
          <Link
            href={`/register?next=${next}`}
            onClick={() => closeSignInPrompt()}
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-11 w-full font-semibold")}
          >
            <UserCirclePlus size={18} weight="bold" aria-hidden="true" />
            {t("register")}
          </Link>
          <Button variant="ghost" className="h-10 w-full text-muted-foreground" onClick={() => closeSignInPrompt()}>
            {t("later")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
