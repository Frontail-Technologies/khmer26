"use client"

import { useState } from "react"
import {
  FileText,
  Plus,
  PencilSimple,
  MagnifyingGlass,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAdminStaticPages } from "../hooks/content.queries"
import { useCreateStaticPage, useUpdateStaticPage } from "../hooks/content.mutations"
import { staticPageFormSchema } from "../schemas/content.schema"
import { toast } from "sonner"
import type { StaticPageItem } from "../types"

interface StaticPagesWorkspaceProps {
  initialPages?: StaticPageItem[]
}

export function StaticPagesWorkspace({ initialPages: fallbackPages = [] }: StaticPagesWorkspaceProps) {
  const { data: remotePages } = useAdminStaticPages()
  const pages = remotePages ?? fallbackPages
  const createPage = useCreateStaticPage()
  const updatePage = useUpdateStaticPage()

  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<StaticPageItem | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formContent, setFormContent] = useState("")
  const [formIsActive, setFormIsActive] = useState(true)

  const openAddModal = () => {
    setEditingPage(null)
    setFormTitle("")
    setFormSlug("")
    setFormContent("")
    setFormIsActive(true)
    setIsDialogOpen(true)
  }

  const openEditModal = (page: StaticPageItem) => {
    setEditingPage(page)
    setFormTitle(page.title)
    setFormSlug(page.slug)
    setFormContent(page.content)
    setFormIsActive(page.isActive)
    setIsDialogOpen(true)
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()

    const slug =
      (editingPage ? editingPage.slug : formSlug.trim()) ||
      formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const validationResult = staticPageFormSchema.safeParse({
      title: formTitle.trim(),
      slug,
      content: formContent.trim(),
      isActive: formIsActive,
    })

    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0]?.message || "Please check form inputs")
      return
    }

    if (editingPage) {
      updatePage.mutate(
        { slug: editingPage.slug, data: { title: formTitle.trim(), content: formContent.trim(), isActive: formIsActive } },
        { onSuccess: () => setIsDialogOpen(false) }
      )
    } else {
      const slug =
        formSlug.trim() ||
        formTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      createPage.mutate(
        { slug, title: formTitle.trim(), content: formContent.trim(), isActive: formIsActive },
        { onSuccess: () => setIsDialogOpen(false) }
      )
    }
  }

  const filteredPages = pages.filter((p) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-card shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileText size={20} weight="duotone" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Static Pages</h1>
            <p className="text-xs text-muted-foreground">
              Manage legal and informational pages like Terms of Service and Privacy Policy.
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
              placeholder="Search pages..."
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
                <TableHead className="text-[11px] font-bold">Page</TableHead>
                <TableHead className="text-[11px] font-bold">Slug</TableHead>
                <TableHead className="text-[11px] font-bold">Status</TableHead>
                <TableHead className="text-[11px] font-bold">Updated</TableHead>
                <TableHead className="w-16 text-[11px] font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.length > 0 ? (
                filteredPages.map((p) => (
                  <TableRow key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                    <TableCell className="text-xs font-semibold text-foreground">{p.title}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">/{p.slug}</TableCell>
                    <TableCell>
                      <StatusBadge
                        label={p.isActive ? "Published" : "Draft"}
                        tone={p.isActive ? "success" : "neutral"}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-card">
          <DialogHeader className="p-4 sm:p-5 border-b border-border/60">
            <DialogTitle className="text-sm font-bold text-foreground">
              {editingPage ? "Edit Page" : "Add Page"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure legal and informational content pages.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 p-4 sm:p-5 max-h-[70vh] overflow-y-auto">
            <Field>
              <FieldLabel required>Page Title</FieldLabel>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Terms of Service"
                className="h-9 text-xs"
                required
              />
            </Field>

            {!editingPage && (
              <Field>
                <FieldLabel>Slug</FieldLabel>
                <Input
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="auto-generated-from-title"
                  className="h-9 text-xs font-mono"
                />
              </Field>
            )}

            <Field>
              <FieldLabel required>Content</FieldLabel>
              <Textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Page body content..."
                rows={8}
                className="text-xs resize-none"
                required
              />
            </Field>

            <div className="flex items-center justify-between gap-3 pt-2">
              <div>
                <span className="text-xs font-semibold text-foreground block">Published</span>
                <span className="text-[11px] text-muted-foreground">Visible on the live marketplace</span>
              </div>
              <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
            </div>

            <DialogFooter className="pt-4 border-t border-border/60 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 px-4 sm:px-5 py-3 bg-muted/20 flex flex-row items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!formTitle.trim() || !formContent.trim()}
                className="text-xs font-semibold cursor-pointer"
              >
                {editingPage ? "Save Changes" : "Create Page"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
