"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useQuery } from "@tanstack/react-query"
import { categoryFieldsQueryOptions } from "@/features/categories/api/categories.queries"
import { DynamicFieldRenderer } from "../fields/dynamic-field-renderer"
import type { ListingDraft } from "../../types"
import type { ListingModerationMatch } from "@/features/content/types"
import { ModerationKeywordNotice } from "@/features/content/components/moderation-keyword-notice"
import { useLocalizedLabel } from "@/lib/i18n/localized"

interface DetailsStepProps {
  draft: ListingDraft
  onChange: (updates: Partial<ListingDraft>) => void
  errors?: Record<string, string>
  moderationMatches: ListingModerationMatch[]
}

const CONDITIONS = [
  { id: "new", labelKey: "brandNew", descKey: "neverUsedOriginalPackaging" },
  { id: "like_new", labelKey: "likeNew", descKey: "minimalUseNoFlaws" },
  { id: "good", labelKey: "goodCondition", descKey: "minorSignsWorksFully" },
  { id: "fair", labelKey: "fairCondition", descKey: "visibleWearFullyFunctional" },
  { id: "for_parts", labelKey: "forParts", descKey: "needsRepairOrSalvage" },
] as const

export function DetailsStep({ draft, onChange, errors = {}, moderationMatches }: DetailsStepProps) {
  const tGenerated = useTranslations("generated")
  const getLocalizedLabel = useLocalizedLabel()
  const { data: categoryFields = [], isLoading: isLoadingFields } = useQuery({
    ...categoryFieldsQueryOptions(draft.categoryId),
    enabled: Boolean(draft.categoryId),
  })
  const dynamicFields = categoryFields.map((assignment) => ({
    key: assignment.field.id,
    label: getLocalizedLabel(assignment.field),
    type: assignment.field.fieldType === "boolean" ? "select" as const : assignment.field.fieldType,
    required: assignment.isRequired,
    options:
      assignment.field.fieldType === "boolean"
        ? [{ value: "true", label: tGenerated("yes") }, { value: "false", label: tGenerated("no") }]
        : assignment.field.options.map((option) => ({ value: option.id, label: getLocalizedLabel(option) })),
  }))

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
            <LocalizedText id="listingTitle" /> <span className="text-destructive">*</span>
          </label>
          <span className="text-xxs text-muted-foreground">
            {draft.title.length} / 100
          </span>
        </div>

        <Input
          id="ad-title"
          type="text"
          maxLength={100}
          placeholder={tGenerated("eGToyotaPrius2021HybridLikeNew")}
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={`h-11 text-xs sm:text-sm ${
            errors.title ? "border-destructive ring-1 ring-destructive" : ""
          }`}
        />

        {errors.title && (
          <p className="text-xxs font-medium text-destructive mt-1">
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-foreground">
          <LocalizedText id="itemCondition" /> <span className="text-destructive">*</span>
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
                <span className="text-xs font-bold block">{tGenerated(cond.labelKey)}</span>
                <span className="text-2xs text-muted-foreground block mt-0.5 truncate">
                  {tGenerated(cond.descKey)}
                </span>
              </button>
            )
          })}
        </div>

        {errors.condition && (
          <p className="text-xxs font-medium text-destructive mt-1">
            {errors.condition}
          </p>
        )}
      </div>

      {dynamicFields.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-border/60">
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            <LocalizedText id="categorySpecifications" />
          </h3>

          <DynamicFieldRenderer
            fields={dynamicFields}
            values={draft.attributes}
            onChange={handleAttributeChange}
            errors={errors}
          />
        </div>
      )}

      {isLoadingFields && (
        <p className="text-xs text-muted-foreground"><LocalizedText id="loadingCategorySpecifications" /></p>
      )}

      <div className="space-y-1.5 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label htmlFor="ad-description" className="text-xs font-bold text-foreground">
            <LocalizedText id="description" /> <span className="text-destructive">*</span>
          </label>
          <span className="text-xxs text-muted-foreground">
            {draft.description.length} / 2500
          </span>
        </div>

        <Textarea
          id="ad-description"
          rows={5}
          maxLength={2500}
          placeholder={tGenerated("describeConditionReasonForSellingAccessoriesIncludedPickupOption")}
          value={draft.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className={`text-xs sm:text-sm ${
            errors.description ? "border-destructive ring-1 ring-destructive" : ""
          }`}
        />

        {errors.description && (
          <p className="text-xxs font-medium text-destructive mt-1">
            {errors.description}
          </p>
        )}
        <ModerationKeywordNotice matches={moderationMatches} />
      </div>
    </div>
  )
}
