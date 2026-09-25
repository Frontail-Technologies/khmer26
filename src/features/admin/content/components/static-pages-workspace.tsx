"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Article,
  Plus,
  PencilSimple,
  Trash,
  ArrowSquareOut,
  MagnifyingGlass,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/status-badge"
import type { StaticPageItem } from "../types"

interface StaticPagesWorkspaceProps {
  initialPages: StaticPageItem[]
}

const CATEGORY_OPTIONS = [
  { value: "General", label: "General" },
  { value: "Legal", label: "Legal & Policies" },
  { value: "Safety", label: "Trust & Safety" },
  { value: "Support", label: "Support & FAQ" },
]

const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
]

export function StaticPagesWorkspace({ initialPages }: StaticPagesWorkspaceProps) {
  const [pages, setPages] = useState<StaticPageItem[]>(initialPages)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<StaticPageItem | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formCategory, setFormCategory] = useState("General")
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published")
  const [formContent, setFormContent] = useState("")

  const openAddModal = () => {
    setEditingPage(null)
    setFormTitle("")
    setFormSlug("")
    setFormCategory("General")
    setFormStatus("published")
    setFormContent("")
    setIsSheetOpen(true)
  }

  const openEditModal = (p: StaticPageItem) => {
    setEditingPage(p)
    setFormTitle(p.title)
    setFormSlug(p.slug)
    setFormCategory(p.category)
    setFormStatus(p.status)
    setFormContent(p.content)
    setIsSheetOpen(true)
  }

  const handleDeletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    const computedSlug =
      formSlug.trim() ||
      formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const todayStr = "2026-03-25"

    if (editingPage) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === editingPage.id
            ? {
                ...p,
                title: formTitle.trim(),
                slug: computedSlug,
                category: formCategory,
                status: formStatus,
                content: formContent,
                updatedAt: todayStr,
              }
            : p
        )
      )
    } else {
      const newPage: StaticPageItem = {
        id: `page-${computedSlug}`,
        title: formTitle.trim(),
        slug: computedSlug,
        category: formCategory,
        status: formStatus,
        content: formContent,
        updatedAt: todayStr,
      }
      setPages((prev) => [...prev, newPage])
    }

    setIsSheetOpen(false)
  }

  const filteredPages = pages.filter((p) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-card shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Article size={20} weight="duotone" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Static Pages</h1>
            <p className="text-xs text-muted-foreground">
              Manage marketplace policies, guidelines, and informational content.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={openAddModal}
          className="h-8 text-xs font-semibold gap-1.5 cursor-pointer shrink-0"
        >
          <Plus size={14} weight="bold" />
          <span>Add Page</span>
        </Button>
      </div>

      <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden flex flex-col min-w-0">
        <div className="p-3.5 border-b border-border/60">
          <div className="relative max-w-sm">
            <MagnifyingGlass
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search static pages by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-w-0 flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
                <TableHead className="text-[11px] font-bold">Page Title</TableHead>
                <TableHead className="text-[11px] font-bold">Category</TableHead>
                <TableHead className="text-[11px] font-bold">Status</TableHead>
                <TableHead className="text-[11px] font-bold">Last Updated</TableHead>
                <TableHead className="w-24 text-[11px] font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.length > 0 ? (
                filteredPages.map((p) => (
                  <TableRow key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                    <TableCell className="min-w-56">
                      <span className="text-xs font-semibold text-foreground block">
                        {p.title}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        /{p.slug}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {p.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={p.status === "published" ? "Published" : "Draft"}
                        tone={p.status === "published" ? "success" : "neutral"}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{p.updatedAt}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          render={
                            <Link
                              href={`/${p.slug}`}
                              target="_blank"
                              className="flex items-center justify-center size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                              aria-label="Preview page"
                            >
                              <ArrowSquareOut size={13} />
                            </Link>
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => openEditModal(p)}
                          className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                          aria-label="Edit page"
                        >
                          <PencilSimple size={13} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDeletePage(p.id)}
                          className="size-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                          aria-label="Delete page"
                        >
                          <Trash size={13} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-xs text-muted-foreground">
                    No static pages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg p-0 flex flex-col h-full overflow-hidden bg-card"
        >
          <SheetHeader className="p-4 sm:p-5 border-b border-border/60">
            <SheetTitle className="text-sm font-bold text-foreground">
              {editingPage ? "Edit Static Page" : "Add Static Page"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Author and publish marketplace content and policy articles.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveForm} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <Field>
                <FieldLabel required>Page Title</FieldLabel>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Terms & Conditions"
                  className="h-9 text-xs"
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>Slug</FieldLabel>
                  <Input
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="terms-and-conditions"
                    className="h-9 text-xs"
                  />
                </Field>

                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Select
                    value={formCategory}
                    onValueChange={(val) => {
                      if (val) setFormCategory(val)
                    }}
                    items={CATEGORY_OPTIONS}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue>
                        {getSelectOptionLabel(CATEGORY_OPTIONS, formCategory, "Category")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={formStatus}
                  onValueChange={(val) => {
                    if (val) setFormStatus(val as "published" | "draft")
                  }}
                  items={STATUS_OPTIONS}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue>
                      {getSelectOptionLabel(STATUS_OPTIONS, formStatus, "Status")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel required>Page Content (Markdown)</FieldLabel>
                <Textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write policy or informational content in markdown..."
                  rows={10}
                  className="text-xs font-mono resize-none leading-relaxed"
                  required
                />
              </Field>
            </div>

            <SheetFooter className="p-4 border-t border-border/60 bg-muted/20 flex flex-row items-center justify-end gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSheetOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!formTitle.trim()}
                className="text-xs font-semibold cursor-pointer"
              >
                {editingPage ? "Save Changes" : "Create Page"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
