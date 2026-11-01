"use client"

import { useEffect, useMemo, useState, type ComponentType, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, MagnifyingGlass, Storefront, UserCircle, type IconProps } from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { cn } from "@/lib/utils"
import { ADMIN_DESTINATIONS } from "../navigation/admin-navigation"
import { useQuery } from "@tanstack/react-query"
import { getAdminUsers } from "../users/api/users.api"
import { getAdminListings } from "../listings/api/listings.api"

const OPEN_EVENT = "admin:open-search"

/** Open the admin search from anywhere (top bar, phone tab bar). */
export function openAdminSearch() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

interface Result {
  key: string
  group: string
  title: string
  subtitle?: string
  href: string
  icon: ComponentType<IconProps>
}

/**
 * ⌘K / Ctrl+K search: jump to any admin page, or find a user (name, email, phone) or a listing
 * (title, ID) and open it directly.
 */
export function AdminCommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const term = useDebouncedValue(query.trim(), 200)
  const remote = term.length >= 2

  // Only query while the palette is open and something meaningful has been typed.
  const users = useQuery({
    queryKey: ["admin", "search", "users", term],
    queryFn: () => getAdminUsers({ page: 1, limit: 5, q: term }),
    enabled: open && remote,
    staleTime: 30_000,
  })
  const listings = useQuery({
    queryKey: ["admin", "search", "listings", term],
    queryFn: () => getAdminListings({ page: 1, limit: 5, q: term }),
    enabled: open && remote,
    staleTime: 30_000,
  })

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener("keydown", onKey)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener(OPEN_EVENT, onOpen)
    }
  }, [])

  const results = useMemo<Result[]>(() => {
    const needle = query.trim().toLowerCase()
    const pages = ADMIN_DESTINATIONS.filter((page) => !needle || page.title.toLowerCase().includes(needle))
      .slice(0, needle ? 6 : 12)
      .map<Result>((page) => ({ key: `page:${page.href}`, group: "Pages", title: page.title, subtitle: page.group, href: page.href, icon: page.icon }))
    if (!remote) return pages
    const userResults = (users.data?.items ?? []).map<Result>((user) => ({
      key: `user:${user.id}`,
      group: "Users",
      title: user.name || user.email,
      subtitle: [user.email, user.phone].filter(Boolean).join(" · "),
      href: `/users/${user.id}`,
      icon: UserCircle,
    }))
    const listingResults = (listings.data?.items ?? []).map<Result>((listing) => ({
      key: `listing:${listing.id}`,
      group: "Listings",
      title: listing.title,
      subtitle: `${listing.displayId} · ${listing.seller.name}`,
      href: `/listings/${listing.id}`,
      icon: Storefront,
    }))
    return [...userResults, ...listingResults, ...pages]
  }, [query, remote, users.data?.items, listings.data?.items])

  const go = (result: Result | undefined) => {
    if (!result) return
    setOpen(false)
    setQuery("")
    router.push(result.href)
  }

  const onInputKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter") {
      event.preventDefault()
      go(results[active])
    }
  }

  const searching = remote && (users.isFetching || listings.isFetching)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="top-[12dvh] max-h-[76dvh] translate-y-0 gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Search admin</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border/60 px-4">
          <MagnifyingGlass size={18} className="shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onInputKey}
            placeholder="Search users, listings, pages"
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Search users, listings, pages"
          />
          {searching && <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
          <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 text-2xs font-semibold text-muted-foreground sm:inline">Esc</kbd>
        </div>
        <ul className="max-h-[60dvh] overflow-y-auto p-2" role="listbox">
          {results.length === 0 && !searching && (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">No results</li>
          )}
          {results.map((result, index) => {
            const header = index === 0 || results[index - 1]?.group !== result.group ? result.group : null
            const ResultIcon = result.icon
            return (
              <li key={result.key}>
                {header && <p className="px-3 pb-1 pt-2 text-2xs font-bold uppercase tracking-wider text-muted-foreground">{header}</p>}
                <button
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(result)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    index === active ? "bg-primary/10" : "hover:bg-muted/60"
                  )}
                >
                  <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", index === active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    <ResultIcon size={16} weight="duotone" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">{result.title}</span>
                    {result.subtitle && <span className="block truncate text-xs text-muted-foreground">{result.subtitle}</span>}
                  </span>
                  {index === active && <ArrowRight size={14} weight="bold" className="shrink-0 text-primary" />}
                </button>
              </li>
            )
          })}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
