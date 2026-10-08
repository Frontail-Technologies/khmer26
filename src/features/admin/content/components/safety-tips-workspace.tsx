"use client"

import { useState } from "react"
import {
  ShieldCheck,
  Plus,
  PencilSimple,
  Trash,
  ArrowUp,
  ArrowDown,
  MagnifyingGlass,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DragReorderList } from "@/components/shared/drag-reorder-list"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog"
import { useAdminSafetyTips } from "../hooks/content.queries"
import {
  useCreateSafetyTip,
  useUpdateSafetyTip,
  useDeleteSafetyTip,
} from "../hooks/content.mutations"
import { safetyTipFormSchema } from "../schemas/content.schema"
import { toast } from "sonner"
import type { SafetyTipItem, SafetyTipContext } from "../types"

interface SafetyTipsWorkspaceProps {
  initialTips?: SafetyTipItem[]
}

const CONTEXT_OPTIONS = [
  { value: "listing_detail", label: "Listing Detail Safety Card" },
  { value: "chat_messages", label: "Chat Messages Safety Notice" },
  { value: "general_safety", label: "General Safety Guidelines" },
]

export function SafetyTipsWorkspace({ initialTips: fallbackTips = [] }: SafetyTipsWorkspaceProps) {
  const { data: remoteTips } = useAdminSafetyTips()
  const tips = remoteTips ?? fallbackTips
  const createTip = useCreateSafetyTip()
  const updateTip = useUpdateSafetyTip()
  const deleteTip = useDeleteSafetyTip()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTip, setEditingTip] = useState<SafetyTipItem | null>(null)
  const [tipToDelete, setTipToDelete] = useState<SafetyTipItem | null>(null)

  const [formTip, setFormTip] = useState("")
  const [formContext, setFormContext] = useState<SafetyTipContext>("listing_detail")
  const [formIsActive, setFormIsActive] = useState(true)

  const openAddModal = () => {
    setEditingTip(null)
    setFormTip("")
    setFormContext("listing_detail")
    setFormIsActive(true)
    setIsDialogOpen(true)
  }

  const openEditModal = (t: SafetyTipItem) => {
    setEditingTip(t)
    setFormTip(t.tip)
    setFormContext(t.context)
    setFormIsActive(t.isActive)
    setIsDialogOpen(true)
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateTip.mutate({ id, data: { isActive } })
  }

  const persistReorderedTips = (newTips: SafetyTipItem[]) => {
    newTips.forEach((t, idx) => {
      updateTip.mutate({ id: t.id, data: { sortOrder: idx + 1 } })
    })
  }

  const handleMoveTip = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= tips.length) return

    const newTips = [...tips]
    const temp = newTips[index]
    const target = newTips[targetIndex]
    if (!temp || !target) return

    newTips[index] = target
    newTips[targetIndex] = temp

    persistReorderedTips(newTips)
  }

  const handleDeleteTip = () => {
    if (!tipToDelete) return
    deleteTip.mutate(tipToDelete.id, {
      onSuccess: () => setTipToDelete(null),
    })
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()

    const validationResult = safetyTipFormSchema.safeParse({
      tip: formTip.trim(),
      context: formContext,
      isActive: formIsActive,
      sortOrder: editingTip ? editingTip.sortOrder : tips.length + 1,
    })

    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0]?.message || "Please check form inputs")
      return
    }

    if (editingTip) {
      updateTip.mutate(
        { id: editingTip.id, data: { tip: formTip.trim(), context: formContext, isActive: formIsActive } },
        { onSuccess: () => setIsDialogOpen(false) }
      )
    } else {
      createTip.mutate(
        { tip: formTip.trim(), context: formContext, isActive: formIsActive, sortOrder: tips.length + 1 },
        { onSuccess: () => setIsDialogOpen(false) }
      )
    }
  }

  const filteredTips = tips.filter((t) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return t.tip.toLowerCase().includes(q) || t.context.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-card shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck size={20} weight="duotone" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Safety Tips</h1>
            <p className="text-xs text-muted-foreground">
              Manage buyer and seller safety guidelines shown across the marketplace.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={openAddModal}
          className="h-8 text-xs font-semibold gap-1.5 cursor-pointer shrink-0"
        >
          <Plus size={14} weight="bold" />
          <span>Add Safety Tip</span>
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
              placeholder="Search safety tips..."
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
                <TableHead className="w-16 text-[11px] font-bold text-center">Order</TableHead>
                <TableHead className="text-[11px] font-bold">Safety Guideline</TableHead>
                <TableHead className="text-[11px] font-bold">Placement / Context</TableHead>
                <TableHead className="text-[11px] font-bold">Status</TableHead>
                <TableHead className="w-20 text-[11px] font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTips.length > 0 ? (
                <DragReorderList
                  as="fragment"
                  itemAs="tr"
                  items={filteredTips}
                  getId={(t) => t.id}
                  onReorder={persistReorderedTips}
                  itemClassName="border-b border-border/50 hover:bg-muted/20"
                  renderItem={(t, idx, { isDragging, isDropTarget }) => {
                  const isFirst = idx === 0
                  const isLast = idx === filteredTips.length - 1

                  return (
                    <>
                      <TableCell className={cn("text-center", isDragging && "opacity-40", isDropTarget && "bg-primary/5")}>
                        <div className="flex items-center justify-center gap-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            disabled={isFirst}
                            onClick={() => handleMoveTip(idx, "up")}
                            className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label="Move tip up"
                          >
                            <ArrowUp size={11} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            disabled={isLast}
                            onClick={() => handleMoveTip(idx, "down")}
                            className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label="Move tip down"
                          >
                            <ArrowDown size={11} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-64 max-w-md">
                        <span className="text-xs font-medium text-foreground leading-relaxed block">
                          {t.tip}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {t.context.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={t.isActive}
                          onCheckedChange={(checked) => handleToggleActive(t.id, checked)}
                          aria-label="Toggle active state for safety tip"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => openEditModal(t)}
                            className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label="Edit tip"
                          >
                            <PencilSimple size={13} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setTipToDelete(t)}
                            className="size-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                            aria-label="Delete tip"
                          >
                            <Trash size={13} />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )
                  }}
                />
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-xs text-muted-foreground">
                    No safety tips found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card">
          <DialogHeader className="p-4 sm:p-5 border-b border-border/60">
            <DialogTitle className="text-sm font-bold text-foreground">
              {editingTip ? "Edit Safety Tip" : "Add Safety Tip"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure trust guidelines displayed to buyers and sellers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 p-4 sm:p-5">
            <Field>
              <FieldLabel required>Safety Guideline Text</FieldLabel>
              <Textarea
                value={formTip}
                onChange={(e) => setFormTip(e.target.value)}
                placeholder="e.g. Always inspect items in person in a public area before payment..."
                rows={3}
                className="text-xs resize-none"
                required
              />
            </Field>

            <Field>
              <FieldLabel>Placement Surface</FieldLabel>
              <Select
                value={formContext}
                onValueChange={(val) => {
                  if (val) setFormContext(val as SafetyTipContext)
                }}
                items={CONTEXT_OPTIONS}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue>
                    {getSelectOptionLabel(CONTEXT_OPTIONS, formContext, "Select context")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CONTEXT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="flex items-center justify-between gap-3 pt-2">
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Active Status
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Display tip on selected marketplace surface
                </span>
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
                disabled={!formTip.trim()}
                className="text-xs font-semibold cursor-pointer"
              >
                {editingTip ? "Save Changes" : "Create Tip"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={Boolean(tipToDelete)}
        onOpenChange={(open) => {
          if (!open) setTipToDelete(null)
        }}
        title="Delete safety tip?"
        description="This will permanently remove this safety tip from admin and live marketplace safety placements."
        confirmLabel="Delete Tip"
        variant="destructive"
        isPending={deleteTip.isPending}
        onConfirm={handleDeleteTip}
      />
    </div>
  )
}
