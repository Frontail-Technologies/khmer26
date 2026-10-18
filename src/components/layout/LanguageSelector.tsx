"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check } from "@phosphor-icons/react"
import { LOCALES, type Locale } from "@/i18n/config"
import { setLocaleCookie } from "@/lib/i18n/set-locale-cookie"

export type LanguageCode = Locale

/** Each language is always shown in its own script so people can find theirs. */
const NATIVE_NAMES: Record<Locale, string> = {
  en: "English",
  km: "ភាសាខ្មែរ",
}

function UkFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={`shrink-0 rounded-full shadow-xs ${className}`}
      aria-hidden="true"
    >
      <clipPath id="uk-circle-clip">
        <circle cx="30" cy="30" r="30" />
      </clipPath>
      <g clipPath="url(#uk-circle-clip)">
        <rect width="60" height="60" fill="#012169" />
        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#ffffff" strokeWidth="12" />
        <path d="M0,0 L60,60" stroke="#C8102E" strokeWidth="4" />
        <path d="M60,0 L0,60" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v60 M0,30 h60" stroke="#ffffff" strokeWidth="20" />
        <path d="M30,0 v60 M0,30 h60" stroke="#C8102E" strokeWidth="12" />
      </g>
    </svg>
  )
}

function CambodiaFlagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={`shrink-0 rounded-full shadow-xs ${className}`}
      aria-hidden="true"
    >
      <clipPath id="kh-circle-clip">
        <circle cx="30" cy="30" r="30" />
      </clipPath>
      <g clipPath="url(#kh-circle-clip)">
        <rect width="60" height="15" fill="#032ea1" />
        <rect y="15" width="60" height="30" fill="#e00025" />
        <rect y="45" width="60" height="15" fill="#032ea1" />
        <g fill="#ffffff">
          <path d="M22 38h16v-2h-16z M24 36h12v-6h-12z M25 30l5-8 5 8z M23 33l2-4 2 4z M33 33l2-4 2 4z M20 38h20v2H20z" />
        </g>
      </g>
    </svg>
  )
}

const Flag = ({ code, className }: { code: Locale; className?: string }) =>
  code === "en" ? <UkFlagIcon className={className} /> : <CambodiaFlagIcon className={className} />

/**
 * Switches the interface language. The choice is stored in a cookie (read on the server by
 * `src/i18n/request.ts`), then the route is refreshed so server and client components re-render
 * in the new language without changing the URL.
 */
export function LanguageSelector() {
  const t = useTranslations("language")
  const current = useLocale() as Locale
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const choose = (code: Locale) => {
    if (code === current) return
    setLocaleCookie(code)
    startTransition(() => router.refresh())
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 focus:outline-none disabled:opacity-60"
        aria-label={t("change")}
        disabled={pending}
      >
        <Flag code={current} className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 p-1.5">
        {LOCALES.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => choose(code)}
            className="flex items-center justify-between gap-2 px-2.5 py-2 cursor-pointer rounded-md"
          >
            <div className="flex items-center gap-2.5">
              <Flag code={code} className="h-4.5 w-4.5" />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">{NATIVE_NAMES[code]}</span>
                <span className="text-xxs text-muted-foreground">
                  {code === "en" ? t("english") : t("khmer")}
                </span>
              </div>
            </div>
            {current === code && <Check size={16} className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
