"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  BellSlash,
  BookmarkSimple,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  Trash,
  Warning,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { AccountPageHeader } from "../../components/account-page-header"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { serializeSearchFilters } from "@/features/search/lib/search-filters"
import { formatCompactRelativeTime } from "@/lib/formatters/date"
import { useSavedSearches } from "../api/saved-searches.queries"
import { useDeleteSavedSearch, useUpdateSavedSearch } from "../api/saved-searches.mutations"
import type { SavedSearch } from "../api/saved-searches.api"

function resultHref(search: SavedSearch): string {
  const params = serializeSearchFilters(search.filters).toString()
  return params ? `/search?${params}` : "/search"
}

function filterLabels(search: SavedSearch): string[] {
  const { filters } = search
  const labels: string[] = []
  if (filters.q) labels.push(`"${filters.q}"`)
  if (filters.category) labels.push(filters.category.replace(/-/g, " "))
  if (filters.provinceId) labels.push(`Province ${filters.provinceId}`)
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    labels.push(`Price ${filters.minPrice ?? 0} - ${filters.maxPrice ?? "Any"} ${filters.currency ?? ""}`.trim())
  }
  labels.push(...Object.entries(filters.fields).map(([key, value]) => `${key}: ${value}`))
  return labels.slice(0, 4)
}

export function SavedSearchesView() {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const t = useTranslations("ui.account")
  const searches = useSavedSearches()
  const updateSearch = useUpdateSavedSearch()
  const deleteSearch = useDeleteSavedSearch()
  const [renaming, setRenaming] = useState<SavedSearch | null>(null)
  const [deleting, setDeleting] = useState<SavedSearch | null>(null)
  const [name, setName] = useState("")

  const beginRename = (search: SavedSearch) => {
    setRenaming(search)
    setName(search.name)
  }

  const saveName = async () => {
    if (!renaming || !name.trim()) return
    try {
      await updateSearch.mutateAsync({ id: renaming.id, input: { name: name.trim() } })
      toast.success(tGenerated("savedSearchRenamed"))
      setRenaming(null)
    } catch {
      // The mutation displays the API error.
    }
  }

  const toggleNotifications = async (search: SavedSearch, checked: boolean) => {
    try {
      await updateSearch.mutateAsync({ id: search.id, input: { notificationsEnabled: checked } })
      toast.success(checked ? t("searchAlertsOn") : t("searchAlertsOff"))
    } catch {
      // The mutation displays the API error.
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteSearch.mutateAsync(deleting.id)
      toast.success(tGenerated("savedSearchDeleted"))
      setDeleting(null)
    } catch {
      // The mutation displays the API error.
    }
  }

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title={tGenerated("savedSearches")}
        action={
          <Button
            className="h-10 gap-1.5 text-xs font-bold"
            render={<Link href="/search"><Plus size={16} weight="bold" /><span><LocalizedText id="newSearch" /></span></Link>}
          />
        }
      />

      {searches.isPending ? (
        <div className="rounded-xl border border-border/80 bg-card p-10 text-center text-sm text-muted-foreground"><LocalizedText id="loadingSavedSearches" /></div>
      ) : searches.isError ? (
        <div className="rounded-xl border border-destructive/30 bg-card p-10 text-center">
          <p className="text-sm font-semibold text-destructive"><LocalizedText id="weCouldnTLoadYourSavedSearches" /></p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => searches.refetch()}><LocalizedText id="tryAgain" /></Button>
        </div>
      ) : searches.data?.items.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {searches.data.items.map((search) => {
            const labels = filterLabels(search)
            return (
              <Card key={search.id} className="rounded-lg border-border/80 p-4 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MagnifyingGlass size={18} weight="bold" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={resultHref(search)} className="font-bold text-sm text-foreground hover:text-primary">
                      {search.name}
                    </Link>
                    <p className="mt-0.5 text-xxs text-muted-foreground">
                      {tDynamic("updatedAt", { time: formatCompactRelativeTime(search.updatedAt) })}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label={`Rename ${search.name}`} onClick={() => beginRename(search)}>
                      <PencilSimple size={16} />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label={`Delete ${search.name}`} className="text-destructive" onClick={() => setDeleting(search)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex min-h-7 flex-wrap gap-1.5">
                  {labels.length ? labels.map((label) => (
                    <span key={label} className="rounded-md bg-muted px-2 py-1 text-2xs font-medium text-muted-foreground capitalize">{label}</span>
                  )) : <span className="text-xs text-muted-foreground"><LocalizedText id="allMarketplaceListings" /></span>}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    {search.notificationsEnabled ? <Bell size={15} className="text-primary" /> : <BellSlash size={15} />}
                    <span><LocalizedText id="resultAlerts" /></span>
                  </div>
                  <Switch
                    checked={search.notificationsEnabled}
                    onCheckedChange={(checked) => toggleNotifications(search, checked)}
                    disabled={updateSearch.isPending}
                    aria-label={`Result alerts for ${search.name}`}
                  />
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/80 bg-card/40 p-8">
          <EmptyState
            icon={<BookmarkSimple size={32} className="text-muted-foreground" />}
            title={tGenerated("noSavedSearchesYet")}
            description={tGenerated("savedSearchesEmptyDescription")}
            action={{ label: t("searchMarketplace"), href: "/search" }}
          />
        </div>
      )}

      <Dialog open={Boolean(renaming)} onOpenChange={(open) => !open && setRenaming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><LocalizedText id="renameSavedSearch" /></DialogTitle>
          </DialogHeader>
          <Input value={name} maxLength={80} onChange={(event) => setName(event.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenaming(null)}><LocalizedText id="cancel" /></Button>
            <Button disabled={!name.trim() || updateSearch.isPending} onClick={saveName}><LocalizedText id="save" /></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive"><Warning size={21} weight="bold" /></div>
            <DialogTitle><LocalizedText id="deleteSavedSearch" /></DialogTitle>
            <DialogDescription>
              {tDynamic("deleteSavedSearchNamed", { name: deleting?.name ?? "" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}><LocalizedText id="cancel" /></Button>
            <Button variant="destructive" disabled={deleteSearch.isPending} onClick={confirmDelete}><LocalizedText id="deleteSearch" /></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
