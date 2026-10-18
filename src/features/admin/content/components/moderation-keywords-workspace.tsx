"use client"

import { useMemo, useState } from "react"
import { MagnifyingGlass, PencilSimple, Plus, Trash, WarningCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog"
import { useAdminModerationKeywords } from "../hooks/content.queries"
import { useCreateModerationKeyword, useDeleteModerationKeyword, useUpdateModerationKeyword } from "../hooks/content.mutations"
import type { ModerationKeywordItem } from "../types"

export function ModerationKeywordsWorkspace() {
  const query = useAdminModerationKeywords()
  const createKeyword = useCreateModerationKeyword()
  const updateKeyword = useUpdateModerationKeyword()
  const deleteKeyword = useDeleteModerationKeyword()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ModerationKeywordItem | null>(null)
  const [deleting, setDeleting] = useState<ModerationKeywordItem | null>(null)
  const [keyword, setKeyword] = useState("")
  const [guidance, setGuidance] = useState("")
  const [isActive, setIsActive] = useState(true)

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase()
    if (!term) return query.data ?? []
    return (query.data ?? []).filter((item) =>
      item.keyword.toLocaleLowerCase().includes(term) || item.guidance?.toLocaleLowerCase().includes(term)
    )
  }, [query.data, search])

  const openForm = (item?: ModerationKeywordItem) => {
    setEditing(item ?? null)
    setKeyword(item?.keyword ?? "")
    setGuidance(item?.guidance ?? "")
    setIsActive(item?.isActive ?? true)
    setDialogOpen(true)
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const data = { keyword: keyword.trim(), guidance: guidance.trim() || null, isActive }
    if (editing) await updateKeyword.mutateAsync({ id: editing.id, data })
    else await createKeyword.mutateAsync(data)
    setDialogOpen(false)
  }

  if (query.isPending) {
    return <Card className="space-y-3 rounded-lg p-5"><Skeleton className="h-9 w-full" /><Skeleton className="h-64 w-full" /></Card>
  }

  return (
    <Card className="rounded-lg">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search review keywords..." className="pl-9" />
        </div>
        <Button onClick={() => openForm()}><Plus /> Add keyword</Button>
      </div>

      {query.isError ? (
        <div className="p-8 text-center"><p className="text-sm font-medium">Review keywords could not be loaded.</p><Button variant="outline" className="mt-3" onClick={() => query.refetch()}>Try again</Button></div>
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center">
          <WarningCircle className="mx-auto text-muted-foreground" size={28} aria-hidden="true" />
          <p className="mt-2 text-sm font-medium">No review keywords found</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filtered.map((item) => (
            <div key={item.id} className="grid gap-3 p-4 sm:grid-cols-[minmax(10rem,0.7fr)_minmax(15rem,1.5fr)_auto] sm:items-center sm:px-5">
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{item.keyword}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Matches title and description</p>
              </div>
              <p className="text-sm leading-5 text-muted-foreground">{item.guidance || "No seller guidance added."}</p>
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <Switch checked={item.isActive} onCheckedChange={(checked) => updateKeyword.mutate({ id: item.id, data: { isActive: checked } })} aria-label={`${item.isActive ? "Disable" : "Enable"} ${item.keyword}`} />
                <Button size="icon-sm" variant="ghost" aria-label={`Edit ${item.keyword}`} onClick={() => openForm(item)}><PencilSimple /></Button>
                <Button size="icon-sm" variant="destructive" aria-label={`Delete ${item.keyword}`} onClick={() => setDeleting(item)}><Trash /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit review keyword" : "Add review keyword"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <Field>
                <FieldLabel htmlFor="review-keyword" required>Keyword or phrase</FieldLabel>
                <Input id="review-keyword" value={keyword} onChange={(event) => setKeyword(event.target.value)} minLength={2} maxLength={120} required autoFocus />
              </Field>
              <Field>
                <FieldLabel htmlFor="review-guidance">Seller guidance</FieldLabel>
                <Textarea id="review-guidance" value={guidance} onChange={(event) => setGuidance(event.target.value)} maxLength={500} placeholder="Explain what the seller should clarify or change." />
              </Field>
              <label className="flex items-center gap-3 text-sm font-medium"><Switch checked={isActive} onCheckedChange={setIsActive} /> Active</label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!keyword.trim() || createKeyword.isPending || updateKeyword.isPending}>{editing ? "Save changes" : "Add keyword"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete review keyword?"
        description={`Future listings will no longer be checked for “${deleting?.keyword ?? "this keyword"}”. Existing listing snapshots are retained.`}
        confirmLabel="Delete keyword"
        variant="destructive"
        isPending={deleteKeyword.isPending}
        onConfirm={async () => { if (deleting) await deleteKeyword.mutateAsync(deleting.id); setDeleting(null) }}
      />
    </Card>
  )
}
