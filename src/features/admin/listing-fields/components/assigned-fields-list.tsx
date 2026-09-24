"use client"

import { useState } from "react"
import {
  CaretUp,
  CaretDown,
  Trash,
  Plus,
  Funnel,
  Sliders,
  DotsSixVertical,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AssignFieldDialog } from "./assign-field-dialog"
import type { ListingField, CategoryFieldAssignment } from "@/features/admin/categories/types"

interface AssignedFieldsListProps {
  categoryId: string
  categoryName: string
  parentCategoryName: string
  assignments: { assignment: CategoryFieldAssignment; field: ListingField }[]
  allFields: ListingField[]
  onUpdateAssignments: (items: { assignment: CategoryFieldAssignment; field: ListingField }[]) => void
}

export function AssignedFieldsList({
  categoryId,
  categoryName,
  parentCategoryName,
  assignments,
  allFields,
  onUpdateAssignments,
}: AssignedFieldsListProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newItems = [...assignments]
    const [removed] = newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, removed)
    newItems.forEach((item, idx) => {
      item.assignment.sortOrder = idx + 1
    })

    onUpdateAssignments(newItems)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...assignments]
    const temp = newItems[index - 1]
    newItems[index - 1] = newItems[index]
    newItems[index] = temp
    newItems.forEach((item, idx) => {
      item.assignment.sortOrder = idx + 1
    })
    onUpdateAssignments(newItems)
  }

  const handleMoveDown = (index: number) => {
    if (index === assignments.length - 1) return
    const newItems = [...assignments]
    const temp = newItems[index + 1]
    newItems[index + 1] = newItems[index]
    newItems[index] = temp
    newItems.forEach((item, idx) => {
      item.assignment.sortOrder = idx + 1
    })
    onUpdateAssignments(newItems)
  }

  const handleToggleActive = (index: number) => {
    const newItems = [...assignments]
    newItems[index].assignment.active = !newItems[index].assignment.active
    onUpdateAssignments(newItems)
  }

  const handleRemove = (index: number) => {
    const newItems = assignments.filter((_, idx) => idx !== index)
    newItems.forEach((item, idx) => {
      item.assignment.sortOrder = idx + 1
    })
    onUpdateAssignments(newItems)
  }

  const handleAssignNew = (newAssignment: CategoryFieldAssignment) => {
    const fieldDef = allFields.find((f) => f.id === newAssignment.fieldId)
    if (!fieldDef) return
    onUpdateAssignments([...assignments, { assignment: newAssignment, field: fieldDef }])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-muted/15 border-b border-border/60">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-foreground">{categoryName}</h2>
            <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.2 rounded-md">
              {assignments.length} {assignments.length === 1 ? "field assigned" : "fields assigned"}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {parentCategoryName} / {categoryName}
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAssignDialogOpen(true)}
          className="h-8.5 px-3.5 text-xs font-bold gap-1.5 rounded-lg cursor-pointer shrink-0"
        >
          <Plus size={13} weight="bold" />
          <span>Assign Existing Field</span>
        </Button>
      </div>

      <div className="p-3.5 sm:p-4 pt-0">
        {assignments.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-border/70 rounded-xl space-y-2">
            <Sliders size={28} weight="duotone" className="mx-auto text-muted-foreground/60" />
            <p className="text-xs font-bold text-foreground">No listing fields assigned yet</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Assign fields from the reusable field library to build the Post Ad form for this category.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAssignDialogOpen(true)}
              className="mt-2 h-8 px-3 text-xs font-bold gap-1.5 rounded-lg"
            >
              <Plus size={13} weight="bold" />
              <span>Assign First Field</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {assignments.map(({ assignment, field }, index) => {
              const isBeingDragged = draggedIndex === index
              const isDropTarget = dragOverIndex === index && draggedIndex !== index

              return (
                <div
                  key={assignment.id || `${field.id}-${index}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border transition-all gap-2.5 ${
                    isBeingDragged
                      ? "opacity-40 scale-[0.99] border-dashed border-primary bg-primary/5 shadow-inner"
                      : isDropTarget
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5 scale-[1.01]"
                      : "border-border/60 bg-card hover:bg-muted/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className="cursor-grab active:cursor-grabbing p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 shrink-0 transition-colors"
                      title="Drag to reorder field position"
                    >
                      <DotsSixVertical size={16} weight="bold" />
                    </div>

                    <div className="size-6 rounded-md bg-muted/70 flex items-center justify-center font-mono text-[10px] font-bold text-muted-foreground shrink-0">
                      #{index + 1}
                    </div>

                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        aria-label="Move Up"
                        disabled={index === 0}
                        onClick={() => handleMoveUp(index)}
                        className="size-5 rounded hover:bg-muted flex items-center justify-center text-muted-foreground disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      >
                        <CaretUp size={11} weight="bold" />
                      </button>
                      <button
                        type="button"
                        aria-label="Move Down"
                        disabled={index === assignments.length - 1}
                        onClick={() => handleMoveDown(index)}
                        className="size-5 rounded hover:bg-muted flex items-center justify-center text-muted-foreground disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      >
                        <CaretDown size={11} weight="bold" />
                      </button>
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-foreground">{field.label}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted/80 text-muted-foreground">
                          {field.key}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground flex-wrap">
                        <span className="uppercase font-semibold text-[10px] tracking-wider px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                          {field.type}
                        </span>
                        {field.options && (
                          <span>· {field.options.length} options</span>
                        )}
                        {field.unit && (
                          <span>· Unit: {field.unit}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pl-7 sm:pl-0">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        assignment.required
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {assignment.required ? "Required" : "Optional"}
                    </Badge>

                    {assignment.filterable && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary"
                        title="Available in search filters"
                      >
                        <Funnel size={10} weight="fill" />
                        <span>Filterable</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleActive(index)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        assignment.active
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground line-through"
                      }`}
                    >
                      {assignment.active ? "Active" : "Inactive"}
                    </button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(index)}
                      aria-label="Remove assignment"
                      className="size-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                    >
                      <Trash size={13} weight="bold" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <AssignFieldDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        categoryName={categoryName}
        categoryId={categoryId}
        availableFields={allFields}
        assignedFieldIds={assignments.map((a) => a.field.id)}
        onAssign={handleAssignNew}
      />
    </div>
  )
}
