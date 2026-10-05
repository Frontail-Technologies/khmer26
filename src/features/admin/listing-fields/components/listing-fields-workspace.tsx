"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Sliders, BookBookmark } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import { AssignedFieldsList } from "./assigned-fields-list"
import { FieldLibraryTable } from "./field-library-table"
import { useAdminCategories } from "@/features/admin/categories/hooks/categories.queries"
import {
  useAdminCategoryFields,
  useAdminFieldLibrary,
} from "@/features/admin/categories/hooks/categories.queries"
import {
  useAssignCategoryField,
  useUpdateCategoryFieldAssignment,
  useRemoveCategoryFieldAssignment,
  useCreateFieldDefinition,
  useUpdateFieldDefinition,
  useDeleteFieldDefinition,
} from "@/features/admin/categories/hooks/categories.mutations"
import type { ListingField, CategoryFieldAssignment, AdminCategoryItem } from "@/features/admin/categories/types"

const EMPTY_CATEGORIES: AdminCategoryItem[] = []

function getInitialCategorySelection(
  categories: AdminCategoryItem[],
  categoryParam: string | null
) {
  if (categoryParam) {
    for (const root of categories) {
      const sub = root.subcategories.find(
        (s) => s.id === categoryParam || s.slug === categoryParam
      )
      if (sub) {
        return { rootId: root.id, subId: sub.id }
      }
    }
  }
  const defaultRoot = categories[0]
  return {
    rootId: defaultRoot?.id ?? "",
    subId: defaultRoot?.subcategories[0]?.id ?? "",
  }
}

export function ListingFieldsWorkspace() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get("category")

  const { data: remoteCategories } = useAdminCategories()
  const categories = remoteCategories ?? EMPTY_CATEGORIES

  const { data: remoteFields } = useAdminFieldLibrary()
  const fields = remoteFields ?? []

  const [activeTab, setActiveTab] = useState<"assigned" | "library">("assigned")

  const selection = useMemo(
    () => getInitialCategorySelection(categories, categoryParam),
    [categories, categoryParam]
  )
  const [manualRootId, setManualRootId] = useState<string | null>(null)
  const [manualSubId, setManualSubId] = useState<string | null>(null)

  const selectedRootId = manualRootId ?? selection.rootId
  const selectedSubId = manualSubId ?? selection.subId

  const selectedRoot = useMemo(() => {
    return categories.find((c) => c.id === selectedRootId) ?? categories[0]
  }, [categories, selectedRootId])

  const subcategories = useMemo(() => {
    return selectedRoot?.subcategories ?? []
  }, [selectedRoot])

  const selectedSub = useMemo(() => {
    return subcategories.find((s) => s.id === selectedSubId) ?? subcategories[0]
  }, [subcategories, selectedSubId])

  const rootSelectOptions = useMemo(() => {
    return categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }))
  }, [categories])

  const subSelectOptions = useMemo(() => {
    return subcategories.map((sub) => ({
      value: sub.id,
      label: sub.name,
    }))
  }, [subcategories])

  const handleRootChange = (newRootId: string) => {
    setManualRootId(newRootId)
    const newRoot = categories.find((c) => c.id === newRootId)
    const firstSub = newRoot?.subcategories[0]
    if (firstSub) {
      setManualSubId(firstSub.id)
      router.replace(`/admin/listing-fields?category=${firstSub.id}`)
    }
  }

  const handleSubChange = (newSubId: string) => {
    setManualSubId(newSubId)
    router.replace(`/admin/listing-fields?category=${newSubId}`)
  }

  const { data: currentAssignments } = useAdminCategoryFields(selectedSub?.id ?? "")
  const assignments = currentAssignments ?? []

  const assignField = useAssignCategoryField()
  const updateAssignment = useUpdateCategoryFieldAssignment()
  const removeAssignment = useRemoveCategoryFieldAssignment()
  const createField = useCreateFieldDefinition()
  const updateField = useUpdateFieldDefinition()
  const deleteField = useDeleteFieldDefinition()

  const handleReorder = (newItems: { assignment: CategoryFieldAssignment; field: ListingField }[]) => {
    if (!selectedSub) return
    newItems.forEach(({ assignment }) => {
      updateAssignment.mutate({
        assignmentId: assignment.id,
        categoryId: selectedSub.id,
        data: { displayOrder: assignment.sortOrder },
      })
    })
  }

  const handleToggleActive = (_assignmentId: string, field: ListingField) => {
    updateField.mutate({ id: field.id, data: { isActive: !field.isActive } })
  }

  const handleRemove = (assignmentId: string) => {
    if (!selectedSub) return
    removeAssignment.mutate({ assignmentId, categoryId: selectedSub.id })
  }

  const handleAssign = (
    field: ListingField,
    options: { required: boolean; filterable: boolean; sortOrder: number }
  ) => {
    if (!selectedSub) return
    assignField.mutate({
      categoryId: selectedSub.id,
      data: {
        name: field.key,
        labelEn: field.label,
        fieldType: field.type,
        isRequired: options.required,
        isFilterable: options.filterable,
        displayOrder: options.sortOrder,
        options: field.options?.map((value) => ({ labelEn: value, value })),
      },
    })
  }

  const handleCreateField = (field: ListingField) => {
    createField.mutate({
      name: field.key,
      labelEn: field.label,
      fieldType: field.type,
      isActive: field.isActive,
      options: field.options?.map((value) => ({ labelEn: value, value })),
    })
  }

  const handleUpdateField = (id: string, field: ListingField) => {
    updateField.mutate({ id, data: { labelEn: field.label, isActive: field.isActive } })
  }

  const handleDeleteField = (id: string) => {
    deleteField.mutate(id)
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-xl border-0 bg-card shadow-2xs overflow-hidden">
        <div className="p-3.5 sm:p-4 bg-muted/20 border-b border-border/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-background rounded-lg border border-border/60 self-start">
            <button
              type="button"
              onClick={() => setActiveTab("assigned")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeTab === "assigned"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sliders size={13} weight="bold" />
              <span>Assigned Fields</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeTab === "library"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookBookmark size={13} weight="bold" />
              <span>Field Library ({fields.length})</span>
            </button>
          </div>

          {activeTab === "assigned" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground shrink-0 hidden sm:inline">
                  Root:
                </span>
                <Select
                  value={selectedRootId}
                  items={rootSelectOptions}
                  onValueChange={(val) => val && handleRootChange(val)}
                >
                  <SelectTrigger size="sm" className="h-8.5 px-2.5 rounded-lg bg-background text-xs font-semibold min-w-44">
                    <SelectValue>
                      {(val) => getSelectOptionLabel(rootSelectOptions, val, "Select Root Category")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {rootSelectOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground shrink-0 hidden sm:inline">
                  Subcategory:
                </span>
                <Select
                  value={selectedSubId}
                  items={subSelectOptions}
                  onValueChange={(val) => val && handleSubChange(val)}
                >
                  <SelectTrigger size="sm" className="h-8.5 px-2.5 rounded-lg bg-background text-xs font-bold min-w-44">
                    <SelectValue>
                      {(val) => getSelectOptionLabel(subSelectOptions, val, "Select Subcategory")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subSelectOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {activeTab === "assigned" ? (
          <AssignedFieldsList
            categoryId={selectedSub?.id ?? ""}
            categoryName={selectedSub?.name ?? ""}
            parentCategoryName={selectedRoot?.name ?? ""}
            assignments={assignments}
            allFields={fields}
            onReorder={handleReorder}
            onToggleActive={handleToggleActive}
            onRemove={handleRemove}
            onAssign={handleAssign}
          />
        ) : (
          <FieldLibraryTable
            fields={fields}
            onCreate={handleCreateField}
            onUpdate={handleUpdateField}
            onDelete={handleDeleteField}
          />
        )}
      </Card>
    </div>
  )
}
