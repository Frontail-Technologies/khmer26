"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { MagnifyingGlass } from "@phosphor-icons/react"
import type { ListingField, CategoryFieldAssignment } from "@/features/admin/categories/types"

interface AssignFieldDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryName: string
  categoryId: string
  availableFields: ListingField[]
  assignedFieldIds: string[]
  onAssign: (assignment: CategoryFieldAssignment) => void
}

export function AssignFieldDialog({
  open,
  onOpenChange,
  categoryName,
  categoryId,
  availableFields,
  assignedFieldIds,
  onAssign,
}: AssignFieldDialogProps) {
  const [search, setSearch] = useState("")
  const [selectedField, setSelectedField] = useState<ListingField | null>(null)
  const [required, setRequired] = useState(false)
  const [filterable, setFilterable] = useState(true)
  const [active, setActive] = useState(true)

  const unassignedFields = useMemo(() => {
    return availableFields.filter((f) => !assignedFieldIds.includes(f.id))
  }, [availableFields, assignedFieldIds])

  const filteredFields = useMemo(() => {
    if (!search.trim()) return unassignedFields
    const q = search.toLowerCase()
    return unassignedFields.filter(
      (f) => f.label.toLowerCase().includes(q) || f.key.toLowerCase().includes(q)
    )
  }, [unassignedFields, search])

  const handleClose = () => {
    setSearch("")
    setSelectedField(null)
    setRequired(false)
    setFilterable(true)
    setActive(true)
    onOpenChange(false)
  }

  const handleConfirm = () => {
    if (!selectedField) return
    onAssign({
      id: `a-${Date.now()}`,
      categoryId,
      fieldId: selectedField.id,
      required,
      filterable,
      active,
      sortOrder: assignedFieldIds.length + 1,
    })
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-xl border-0 shadow-lg bg-card">
        <DialogHeader className="p-5 pb-4 border-b border-border/60 bg-muted/20">
          <DialogTitle className="text-base font-bold text-foreground">
            Assign Existing Field
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Attaching field to <span className="font-semibold text-foreground">{categoryName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {!selectedField ? (
            <div className="space-y-3">
              <div className="relative">
                <MagnifyingGlass
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  type="text"
                  placeholder="Search field library by label or key..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9.5 text-xs rounded-lg"
                  autoFocus
                />
              </div>

              <div className="border border-border/60 rounded-xl overflow-hidden divide-y divide-border/60 max-h-64 overflow-y-auto">
                {filteredFields.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    No matching unassigned fields found.
                  </div>
                ) : (
                  filteredFields.map((field) => (
                    <div
                      key={field.id}
                      className="p-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-foreground">{field.label}</span>
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-muted text-muted-foreground">
                            {field.key}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {field.type.toUpperCase()} · Used in {field.usedInCount ?? 0} categories
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setSelectedField(field)}
                        className="h-8 px-3 text-xs font-bold rounded-lg cursor-pointer shrink-0"
                      >
                        Select
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-muted/20 border border-border/60 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground">{selectedField.label}</span>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    key: {selectedField.key} · type: {selectedField.type}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedField(null)}
                  className="h-7 px-2 text-xs font-semibold text-primary cursor-pointer"
                >
                  Change Field
                </Button>
              </div>

              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Category Assignment Settings
                </h3>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/10">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">Mandatory Field</span>
                      <span className="text-[11px] text-muted-foreground block">
                        Requires seller to provide a value before publishing
                      </span>
                    </div>
                    <Switch
                      checked={required}
                      onCheckedChange={setRequired}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/10">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">Search Filterable</span>
                      <span className="text-[11px] text-muted-foreground block">
                        Generates a faceted filter on public search & category pages
                      </span>
                    </div>
                    <Switch
                      checked={filterable}
                      onCheckedChange={setFilterable}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/10">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">Active State</span>
                      <span className="text-[11px] text-muted-foreground block">
                        Visible in Post Ad form when active
                      </span>
                    </div>
                    <Switch
                      checked={active}
                      onCheckedChange={setActive}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="h-9 px-3.5 text-xs rounded-lg cursor-pointer"
            >
              Cancel
            </Button>
            {selectedField && (
              <Button
                type="button"
                size="sm"
                onClick={handleConfirm}
                className="h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
              >
                Assign to Category
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
