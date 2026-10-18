"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, BookmarkSimple } from "@phosphor-icons/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCreateSavedSearch } from "@/features/account/saved-searches/api/saved-searches.mutations"
import type { SearchFilters } from "../lib/search-filters"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"

function suggestedName(filters: SearchFilters): string {
  if (filters.q) return filters.q.slice(0, 80)
  if (filters.category) return filters.category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  return "Marketplace search"
}

export function SaveSearchDialog({ filters }: { filters: SearchFilters }) {
  const tGenerated = useTranslations("generated")
  const router = useRouter()
  const { isAuthenticated, isLoading } = useCurrentUser()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(() => suggestedName(filters))
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const createSearch = useCreateSavedSearch()

  const save = async () => {
    if (!name.trim()) return
    try {
      await createSearch.mutateAsync({ name: name.trim(), filters, notificationsEnabled })
      toast.success(tGenerated("searchSaved"))
      setOpen(false)
    } catch {
      // The mutation displays the API or authentication error.
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 px-2.5 text-xs font-semibold"
        onClick={() => {
          if (!isAuthenticated) {
            const here = window.location.pathname + window.location.search
            router.push(`/login?next=${encodeURIComponent(here)}`)
            return
          }
          setName(suggestedName(filters))
          setOpen(true)
        }}
        disabled={isLoading}
      >
        <BookmarkSimple size={14} weight="bold" />
        <span className="hidden sm:inline"><LocalizedText id="saveSearch" /></span>
        <span className="sm:hidden"><LocalizedText id="save" /></span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><LocalizedText id="saveThisSearch" /></DialogTitle>
            <DialogDescription><LocalizedText id="keepTheseFiltersAndRunTheSameSearchAgain" /></DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="saved-search-name" className="text-xs font-semibold text-foreground"><LocalizedText id="searchName" /></label>
              <Input id="saved-search-name" value={name} maxLength={80} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/80 p-3">
              <div className="flex items-center gap-2">
                <Bell size={17} className="text-primary" />
                <div>
                  <p className="text-xs font-semibold text-foreground"><LocalizedText id="resultAlerts" /></p>
                  <p className="text-xxs text-muted-foreground"><LocalizedText id="notifyMeWhenMatchingListingsAreAvailable" /></p>
                </div>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} aria-label={tGenerated("resultAlerts")} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}><LocalizedText id="cancel" /></Button>
            <Button disabled={!name.trim() || createSearch.isPending} onClick={save}>
              {createSearch.isPending ? tGenerated("saving") : tGenerated("saveSearch")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
