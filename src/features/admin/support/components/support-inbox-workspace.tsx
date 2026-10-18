"use client"

import { useDeferredValue, useState } from "react"
import { CaretLeft, CaretRight, MagnifyingGlass } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { formatAdminDateTime } from "@/lib/formatters/date"
import { useSupportSubmissions, useUpdateSupportSubmission } from "../hooks/support.queries"
import type { SupportStatus, SupportSubmission } from "../types"

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "spam", label: "Spam" },
]

const SUBJECT_LABELS = {
  general: "General inquiry",
  feedback: "Product feedback",
  report_issue: "Technical problem",
  verification: "Verification support",
  business: "Business inquiry",
} as const

function statusVariant(status: SupportStatus) {
  if (status === "spam") return "destructive" as const
  return status === "in_progress" ? "secondary" as const : "outline" as const
}

function statusClassName(status: SupportStatus) {
  if (status === "resolved") return "border-success/30 bg-success/10 text-success"
  if (status === "new") return "border-accent/30 bg-accent/10 text-accent-foreground"
  return undefined
}

function SupportRequestSheet({
  submission,
  open,
  onOpenChange,
}: {
  submission: SupportSubmission | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const update = useUpdateSupportSubmission()
  const [status, setStatus] = useState<SupportStatus>(submission?.status ?? "new")
  const [adminNote, setAdminNote] = useState(submission?.adminNote ?? "")

  if (!submission) return null
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg gap-0 overflow-y-auto">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{submission.displayId}</SheetTitle>
          <SheetDescription>{SUBJECT_LABELS[submission.subject]}</SheetDescription>
        </SheetHeader>
        <div className="space-y-5 p-4">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-muted-foreground">From</dt><dd className="mt-1 font-medium">{submission.name}</dd></div>
            <div><dt className="text-muted-foreground">Received</dt><dd className="mt-1 font-medium">{formatAdminDateTime(submission.createdAt)}</dd></div>
            <div className="col-span-2"><dt className="text-muted-foreground">Email</dt><dd className="mt-1 break-all font-medium">{submission.email}</dd></div>
          </dl>
          <div>
            <p className="mb-2 text-sm font-semibold">Message</p>
            <p className="whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-sm leading-6">{submission.message}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Status</label>
            <Select value={status} items={STATUS_OPTIONS} onValueChange={(value) => value && setStatus(value as SupportStatus)}>
              <SelectTrigger className="w-full"><SelectValue>{(value) => getSelectOptionLabel(STATUS_OPTIONS, value, "New")}</SelectValue></SelectTrigger>
              <SelectContent>{STATUS_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="support-admin-note" className="text-sm font-semibold">Internal note</label>
            <Textarea id="support-admin-note" value={adminNote} onChange={(event) => setAdminNote(event.target.value)} rows={5} placeholder="Add context for other admins..." />
          </div>
          <Button
            disabled={update.isPending}
            onClick={() => update.mutate({ id: submission.id, status, adminNote: adminNote.trim() || null })}
          >
            {update.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function SupportInboxWorkspace() {
  const [status, setStatus] = useState<"all" | SupportStatus>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<SupportSubmission | null>(null)
  const deferredSearch = useDeferredValue(search.trim())
  const query = useSupportSubmissions({
    page,
    limit: 20,
    ...(status !== "all" ? { status } : {}),
    ...(deferredSearch ? { q: deferredSearch } : {}),
  })
  const items = query.data?.items ?? []
  const meta = query.data?.meta

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-2xs">
      <Tabs value={status} onValueChange={(value) => { if (value) { setStatus(value as typeof status); setPage(1) } }} className="border-b border-border/60 bg-muted/20 px-3 pt-2.5 sm:px-4">
        <TabsList variant="line">
          <TabsTrigger value="all">All</TabsTrigger>
          {STATUS_OPTIONS.map((option) => <TabsTrigger key={option.value} value={option.value}>{option.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      <div className="border-b border-border/60 p-3 sm:p-4">
        <div className="relative max-w-xl">
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search name, email, or message..." className="pl-9" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow className="bg-muted/60"><TableHead>Request</TableHead><TableHead>Sender</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Received</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelected(item)}>
                <TableCell className="font-semibold">{item.displayId}</TableCell>
                <TableCell><span className="block font-medium">{item.name}</span><span className="block text-xs text-muted-foreground">{item.email}</span></TableCell>
                <TableCell>{SUBJECT_LABELS[item.subject]}</TableCell>
                <TableCell><Badge variant={statusVariant(item.status)} className={statusClassName(item.status)}>{STATUS_OPTIONS.find((option) => option.value === item.status)?.label}</Badge></TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">{formatAdminDateTime(item.createdAt)}</TableCell>
              </TableRow>
            ))}
            {!query.isLoading && !items.length && <TableRow><TableCell colSpan={5} className="h-40 text-center text-muted-foreground">No support requests found.</TableCell></TableRow>}
            {query.isLoading && <TableRow><TableCell colSpan={5} className="h-40 text-center text-muted-foreground">Loading requests...</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 p-3 sm:p-4">
        <p className="text-xs text-muted-foreground">{meta ? `${meta.total} request${meta.total === 1 ? "" : "s"}` : ""}</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><CaretLeft /></Button>
          <span className="min-w-20 text-center text-xs font-medium">Page {page} of {Math.max(1, Number(meta?.totalPages ?? 1))}</span>
          <Button variant="outline" size="icon-sm" aria-label="Next page" disabled={page >= Number(meta?.totalPages ?? 1)} onClick={() => setPage((value) => value + 1)}><CaretRight /></Button>
        </div>
      </div>
      <SupportRequestSheet key={selected?.id ?? "empty"} submission={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  )
}
