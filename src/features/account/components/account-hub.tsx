"use client"

import { useEffect, useSyncExternalStore, useTransition, type ComponentType, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import {
  Bell,
  BookmarkSimple,
  CaretRight,
  ChatCircleText,
  Crown,
  CreditCard,
  FileText,
  Gear,
  Heart,
  Lifebuoy,
  ListBullets,
  Moon,
  PencilSimple,
  Scroll,
  SealCheck,
  ShieldCheck,
  SignOut,
  Storefront,
  Translate,
  type IconProps,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { setLocaleCookie } from "@/lib/i18n/set-locale-cookie"
import type { Locale } from "@/i18n/config"
import { useLogout } from "@/features/auth/hooks/use-auth"
import { NotificationBell } from "@/features/notifications/components/notification-bell"
import { useAccountProfile } from "../profile/api/profile.queries"
import { useSubscriptionUsage } from "../subscription/api/subscription.queries"

type Icon = ComponentType<IconProps>

function profileCompletion(account: NonNullable<ReturnType<typeof useAccountProfile>["data"]>): number {
  const profile = account.sellerProfile
  const fields = [profile?.fullName, profile?.username, account.user.email, profile?.phone, profile?.provinceId, profile?.bio, profile?.avatarMediaId]
  return Math.round((fields.filter(Boolean).length / fields.length) * 100)
}

/** One tappable list row, iOS/Android settings style. */
function Row({
  href,
  icon: RowIcon,
  label,
  tint = "text-primary bg-primary/10",
  trailing,
  onClick,
  destructive,
}: {
  href?: string
  icon: Icon
  label: string
  tint?: string
  trailing?: ReactNode
  onClick?: () => void
  destructive?: boolean
}) {
  const content = (
    <>
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", destructive ? "bg-destructive/10 text-destructive" : tint)}>
        <RowIcon size={19} weight="duotone" />
      </span>
      <span className={cn("min-w-0 flex-1 truncate text-[15px] font-medium", destructive ? "text-destructive" : "text-foreground")}>{label}</span>
      {trailing ?? (href && <CaretRight size={16} weight="bold" className="shrink-0 text-muted-foreground/60" />)}
    </>
  )
  const className =
    "flex min-h-14 w-full items-center gap-3 px-4 py-2 text-left transition-colors active:bg-muted/70 [@media(hover:hover)]:hover:bg-muted/40"
  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    )
  }
  return <div className={className}>{content}</div>
}

function Group({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section>
      {title && <h2 className="px-5 pb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h2>}
      <div className="mx-3 overflow-hidden rounded-2xl border border-border/60 bg-card divide-y divide-border/50">{children}</div>
    </section>
  )
}

function LanguageToggle() {
  const current = useLocale() as Locale
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const options: Array<{ code: Locale; label: string }> = [
    { code: "km", label: "ខ្មែរ" },
    { code: "en", label: "EN" },
  ]
  return (
    <div className={cn("flex shrink-0 rounded-full bg-muted p-0.5", pending && "opacity-60")} role="radiogroup">
      {options.map((option) => (
        <button
          key={option.code}
          type="button"
          role="radio"
          aria-checked={current === option.code}
          disabled={pending}
          onClick={() => {
            if (option.code === current) return
            setLocaleCookie(option.code)
            startTransition(() => router.refresh())
          }}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold transition-all",
            current === option.code ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

const emptySubscribe = () => () => {}

function DarkModeSwitch({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  // The server cannot know the theme; render "off" until mounted so hydration matches, then the real state.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  return (
    <Switch
      key={mounted ? "client" : "server"}
      checked={mounted && resolvedTheme === "dark"}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      aria-label={label}
    />
  )
}

/**
 * Mobile "Me" tab: profile header, shortcuts and grouped settings rows, like native marketplace apps.
 * Desktop keeps the sidebar layout, so wide screens go straight to My Listings.
 */
export function AccountHub() {
  const t = useTranslations("accountHub")
  const tGenerated = useTranslations("generated")
  const router = useRouter()
  const { data: account, isLoading } = useAccountProfile()
  const { data: usage } = useSubscriptionUsage()
  const logout = useLogout()

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) router.replace("/account/listings")
  }, [router])

  const profile = account?.sellerProfile
  const fallbackName = account?.user.email?.split("@")[0] ?? tGenerated("myAccount")
  const displayName = profile?.fullName || profile?.shopName || fallbackName
  const username = profile?.username || fallbackName
  const avatarUrl = getMediaUrl(profile?.avatarR2Key)
  const percent = account ? profileCompletion(account) : 100

  const shortcuts: Array<{ href: string; label: string; icon: Icon; tint: string }> = [
    { href: "/account/listings", label: t("myAds"), icon: ListBullets, tint: "bg-primary/10 text-primary" },
    { href: "/account/favorites", label: tGenerated("favorites"), icon: Heart, tint: "bg-destructive/10 text-destructive" },
    { href: "/account/saved-searches", label: tGenerated("savedSearches"), icon: BookmarkSimple, tint: "bg-accent/12 text-accent" },
    { href: "/messages", label: tGenerated("messages_f1702b"), icon: ChatCircleText, tint: "bg-success/12 text-success" },
  ]

  return (
    <div className="-mx-3 space-y-5 pb-4 sm:-mx-4 lg:hidden">
      <header className="flex items-center justify-between px-4 pt-1">
        <h1 className="text-2xl font-black tracking-tight text-foreground">{t("title")}</h1>
        <div className="flex items-center gap-1">
          <NotificationBell enableSocket={false} />
          <Link
            href="/account/settings"
            aria-label={tGenerated("settings")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors active:bg-muted"
          >
            <Gear size={21} />
          </Link>
        </div>
      </header>

      {/* Profile card */}
      <div className="mx-3 rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.42_0.17_265)] p-4 text-primary-foreground shadow-lg shadow-primary/20">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="h-16 w-16 rounded-full bg-white/20" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-white/20" />
              <Skeleton className="h-3 w-20 bg-white/20" />
            </div>
          </div>
        ) : (
          <Link href="/account/profile" className="pressable flex items-center gap-3.5">
            <Avatar className="h-16 w-16 shrink-0 border-2 border-white/40">
              <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
              <AvatarFallback className="bg-white/15 text-lg font-bold text-white">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-lg font-bold">{displayName}</p>
                {account?.user.emailVerifiedAt && <SealCheck size={18} weight="fill" className="shrink-0 text-white" aria-label={t("emailVerified")} />}
              </div>
              <p className="truncate text-sm text-white/75">@{username}</p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold">
                <Crown size={12} weight="fill" />
                {usage?.plan.name ?? "Free"}
              </span>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15" aria-label={t("editProfile")}>
              <PencilSimple size={17} weight="bold" />
            </span>
          </Link>
        )}

        {!isLoading && percent < 100 && (
          <Link href="/account/profile" className="mt-4 block rounded-2xl bg-white/12 p-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>{t("completeProfile", { percent })}</span>
              <CaretRight size={14} weight="bold" />
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-[width] duration-700 ease-out" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-1.5 text-xxs text-white/75">{t("completeProfileCta")}</p>
          </Link>
        )}
      </div>

      {/* Shortcuts */}
      <div className="mx-3 grid grid-cols-4 gap-2">
        {shortcuts.map(({ href, label, icon: ShortcutIcon, tint }) => (
          <Link key={href} href={href} className="pressable flex flex-col items-center gap-1.5 rounded-2xl bg-card py-3 text-center shadow-2xs ring-1 ring-border/50">
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-full", tint)}>
              <ShortcutIcon size={21} weight="duotone" />
            </span>
            <span className="w-full truncate px-1 text-xxs font-semibold text-foreground">{label}</span>
          </Link>
        ))}
      </div>

      <Group title={t("accountSection")}>
        <Row href="/account/profile" icon={PencilSimple} label={t("editProfile")} />
        {profile && <Row href={`/seller/${profile.id}`} icon={Storefront} label={t("viewStore")} tint="bg-accent/12 text-accent" />}
        <Row href="/account/notifications" icon={Bell} label={tGenerated("notifications")} tint="bg-warning/15 text-warning-foreground dark:text-warning" />
        <Row href="/account/subscription" icon={Crown} label={tGenerated("subscription")} tint="bg-accent/12 text-accent" />
        <Row href="/account/payments" icon={CreditCard} label={tGenerated("payments")} tint="bg-success/12 text-success" />
      </Group>

      <Group title={t("preferences")}>
        <Row icon={Translate} label={t("language")} trailing={<LanguageToggle />} />
        <Row icon={Moon} label={t("darkMode")} tint="bg-foreground/8 text-foreground" trailing={<DarkModeSwitch label={t("darkMode")} />} />
        <Row href="/account/settings" icon={Gear} label={tGenerated("settings")} tint="bg-foreground/8 text-foreground" />
      </Group>

      <Group title={t("helpSection")}>
        <Row href="/contact" icon={Lifebuoy} label={tGenerated("contactUs")} />
        <Row href="/posting-rules" icon={Scroll} label={tGenerated("postingRules")} />
        <Row href="/terms" icon={FileText} label={tGenerated("termsOfService")} tint="bg-foreground/8 text-foreground" />
        <Row href="/privacy" icon={ShieldCheck} label={tGenerated("privacyPolicy")} tint="bg-foreground/8 text-foreground" />
      </Group>

      <Group>
        <Row
          icon={SignOut}
          label={logout.isPending ? tGenerated("signingOut") : tGenerated("signOut")}
          onClick={() => !logout.isPending && logout.mutate()}
          destructive
        />
      </Group>
    </div>
  )
}
