"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DynamicFieldRenderer } from "../fields/dynamic-field-renderer"
import { getCategoryFields } from "../../data/category-field-config"
import type { ListingDraft } from "../../types"

interface DetailsStepProps {
  draft: ListingDraft
  onChange: (updates: Partial<ListingDraft>) => void
  errors?: Record<string, string>
}

const CONDITIONS = [
  { id: "new", label: "Brand New", desc: "Never used, original packaging" },
  { id: "like_new", label: "Like New", desc: "Minimal use, no flaws" },
  { id: "good", label: "Good Condition", desc: "Minor signs of use, works 100%" },
  { id: "fair", label: "Fair", desc: "Visible wear, fully functional" },
  { id: "for_parts", label: "For Parts", desc: "Needs repair or salvage" },
]

export function DetailsStep({ draft, onChange, errors = {} }: DetailsStepProps) {
  const dynamicFields = getCategoryFields(draft.categorySlug)

  const handleAttributeChange = (key: string, value: string) => {
    onChange({
      attributes: {
        ...draft.attributes,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="ad-title" className="text-xs font-bold text-foreground">
            Listing Title <span className="text-destructive">*</span>
          </label>
          <span className="text-[11px] text-muted-foreground">
            {draft.title.length} / 100
          </span>
        </div>

        <Input
          id="ad-title"
          type="text"
          maxLength={100}
          placeholder="e.g. Toyota Prius 2021 Hybrid (Like New)"
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={`h-11 text-xs sm:text-sm ${
            errors.title ? "border-destructive ring-1 ring-destructive" : ""
          }`}
        />

        {errors.title && (
          <p className="text-[11px] font-medium text-destructive mt-1">
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-foreground">
          Item Condition <span className="text-destructive">*</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CONDITIONS.map((cond) => {
            const isSelected = draft.condition === cond.id

            return (
              <button
                key={cond.id}
                type="button"
                onClick={() => onChange({ condition: cond.id })}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-xs font-bold"
                    : "border-border/80 bg-card hover:bg-muted/40 text-foreground"
                }`}
              >
                <span className="text-xs font-bold block">{cond.label}</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5 truncate">
                  {cond.desc}
                </span>
              </button>
            )
          })}
        </div>

        {errors.condition && (
          <p className="text-[11px] font-medium text-destructive mt-1">
            {errors.condition}
          </p>
        )}
      </div>

      {dynamicFields.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-border/60">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">
              Category Specifications
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Provide specific item details to help buyers find your ad faster
            </p>
          </div>

          <DynamicFieldRenderer
            fields={dynamicFields}
            values={draft.attributes}
            onChange={handleAttributeChange}
            errors={errors}
          />
        </div>
      )}

      <div className="space-y-1.5 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label htmlFor="ad-description" className="text-xs font-bold text-foreground">
            Description <span className="text-destructive">*</span>
          </label>
          <span className="text-[11px] text-muted-foreground">
            {draft.description.length} / 2500
          </span>
        </div>

        <Textarea
          id="ad-description"
          rows={5}
          maxLength={2500}
          placeholder="Describe condition, reason for selling, accessories included, pickup options, etc."
          value={draft.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className={`text-xs sm:text-sm ${
            errors.description ? "border-destructive ring-1 ring-destructive" : ""
          }`}
        />

        {errors.description && (
          <p className="text-[11px] font-medium text-destructive mt-1">
            {errors.description}
          </p>
        )}
      </div>
    </div>
  )
}
