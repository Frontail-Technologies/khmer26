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
import {
  DEMO_LISTING_FIELDS,
  getAssignedFieldsForCategory,
} from "../data/demo-listing-fields"
import { DEMO_ADMIN_CATEGORIES } from "@/features/admin/categories/data/demo-admin-categories"
import type { ListingField, CategoryFieldAssignment } from "@/features/admin/categories/types"

function getInitialCategorySelection(categoryParam: string | null) {
  if (categoryParam) {
    for (const root of DEMO_ADMIN_CATEGORIES) {
      const sub = root.subcategories.find(
        (s) => s.slug === categoryParam || s.id === categoryParam
      )
      if (sub) {
        return { rootId: root.id, subSlug: sub.slug }
      }
    }
  }
  const defaultRoot = DEMO_ADMIN_CATEGORIES[0]
  return {
    rootId: defaultRoot?.id ?? "vehicles",
    subSlug: defaultRoot?.subcategories[0]?.slug ?? "cars",
  }
}

export function ListingFieldsWorkspace() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get("category")

  const [activeTab, setActiveTab] = useState<"assigned" | "library">("assigned")
  const [fields, setFields] = useState<ListingField[]>(DEMO_LISTING_FIELDS)
  const [assignmentsMap, setAssignmentsMap] = useState<Record<string, { assignment: CategoryFieldAssignment; field: ListingField }[]>>(() => {
    const initialMap: Record<string, { assignment: CategoryFieldAssignment; field: ListingField }[]> = {}
    DEMO_ADMIN_CATEGORIES.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        initialMap[sub.slug] = getAssignedFieldsForCategory(sub.slug)
      })
    })
    return initialMap
  })

  const selection = useMemo(() => getInitialCategorySelection(categoryParam), [categoryParam])
  const [manualRootId, setManualRootId] = useState<string | null>(null)
  const [manualSubSlug, setManualSubSlug] = useState<string | null>(null)

  const selectedRootId = manualRootId ?? selection.rootId
  const selectedSubSlug = manualSubSlug ?? selection.subSlug

  const selectedRoot = useMemo(() => {
    return DEMO_ADMIN_CATEGORIES.find((c) => c.id === selectedRootId) ?? DEMO_ADMIN_CATEGORIES[0]
  }, [selectedRootId])

  const subcategories = useMemo(() => {
    return selectedRoot?.subcategories ?? []
  }, [selectedRoot])

  const selectedSub = useMemo(() => {
    return subcategories.find((s) => s.slug === selectedSubSlug) ?? subcategories[0]
  }, [subcategories, selectedSubSlug])

  const rootSelectOptions = useMemo(() => {
    return DEMO_ADMIN_CATEGORIES.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }))
  }, [])

  const subSelectOptions = useMemo(() => {
    return subcategories.map((sub) => ({
      value: sub.slug,
      label: sub.name,
    }))
  }, [subcategories])

  const handleRootChange = (newRootId: string) => {
    setManualRootId(newRootId)
    const newRoot = DEMO_ADMIN_CATEGORIES.find((c) => c.id === newRootId)
    const firstSub = newRoot?.subcategories[0]
    if (firstSub) {
      setManualSubSlug(firstSub.slug)
      router.replace(`/admin/listing-fields?category=${firstSub.slug}`)
    }
  }

  const handleSubChange = (newSubSlug: string) => {
    setManualSubSlug(newSubSlug)
    router.replace(`/admin/listing-fields?category=${newSubSlug}`)
  }

  const currentAssignments = useMemo(() => {
    const key = selectedSub?.slug ?? "cars"
    return assignmentsMap[key] ?? getAssignedFieldsForCategory(key)
  }, [assignmentsMap, selectedSub])

  const handleUpdateCurrentAssignments = (newAssignments: { assignment: CategoryFieldAssignment; field: ListingField }[]) => {
    if (!selectedSub) return
    setAssignmentsMap((prev) => ({
      ...prev,
      [selectedSub.slug]: newAssignments,
    }))
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
                  value={selectedSubSlug}
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
            categoryId={selectedSub?.id ?? "cars"}
            categoryName={selectedSub?.name ?? "Cars & SUVs"}
            parentCategoryName={selectedRoot?.name ?? "Vehicles & Automotive"}
            assignments={currentAssignments}
            allFields={fields}
            onUpdateAssignments={handleUpdateCurrentAssignments}
          />
        ) : (
          <FieldLibraryTable fields={fields} onUpdateFields={setFields} />
        )}
      </Card>
    </div>
  )
}
