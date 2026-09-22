"use client"

import { useSyncExternalStore } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check } from "@phosphor-icons/react"

export type LanguageCode = "en" | "km"

interface LanguageOption {
  code: LanguageCode
  name: string
  nativeName: string
}

const LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
  },
  {
    code: "km",
    name: "Khmer",
    nativeName: "ភាសាខ្មែរ",
  },
]

let activeLanguage: LanguageCode = "en"
const subscribers = new Set<() => void>()

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("khmer26_lang")
  if (saved === "en" || saved === "km") {
    activeLanguage = saved
  }
}

function subscribe(callback: () => void) {
  subscribers.add(callback)
  return () => {
    subscribers.delete(callback)
  }
}

function getSnapshot(): LanguageCode {
  return activeLanguage
}

function getServerSnapshot(): LanguageCode {
  return "en"
}

function setLanguage(code: LanguageCode) {
  activeLanguage = code
  if (typeof window !== "undefined") {
    localStorage.setItem("khmer26_lang", code)
  }
  subscribers.forEach((callback) => callback())
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

export function LanguageSelector() {
  const currentLang = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 focus:outline-none"
        aria-label="Change language"
      >
        {currentLang === "en" ? (
          <UkFlagIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
        ) : (
          <CambodiaFlagIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 p-1.5">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between gap-2 px-2.5 py-2 cursor-pointer rounded-md"
          >
            <div className="flex items-center gap-2.5">
              {lang.code === "en" ? (
                <UkFlagIcon className="h-4.5 w-4.5" />
              ) : (
                <CambodiaFlagIcon className="h-4.5 w-4.5" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">
                  {lang.nativeName}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {lang.name}
                </span>
              </div>
            </div>
            {currentLang === lang.code && (
              <Check size={16} className="text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
