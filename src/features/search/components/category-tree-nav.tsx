"use client"

import { useState } from "react"
import { CaretRight, Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import type { CategoryNode } from "@/features/categories/api/categories.api"
import {
  OPTION_BUTTON_ACTIVE,
  OPTION_BUTTON_BASE,
  OPTION_BUTTON_IDLE,
} from "./filter-section"

interface CategoryTreeNavProps {
  roots: CategoryNode[]
  /** Selected category (URL state). Selection only filters; it never prunes this tree. */
  selectedSlug?: string
  /** Ids from the root down to the selected category, inclusive. */
  ancestorIds: string[]
  onSelect: (slug: string | null) => void
}

/** Manual expand/collapse overrides. They reset whenever the selected category changes. */
interface ExpansionState {
  forSlug: string | undefined
  toggled: Record<string, boolean>
}

export function CategoryTreeNav({ roots, selectedSlug, ancestorIds, onSelect }: CategoryTreeNavProps) {
  const [expansion, setExpansion] = useState<ExpansionState>({
    forSlug: selectedSlug,
    toggled: {},
  })

  let toggled = expansion.toggled
  if (expansion.forSlug !== selectedSlug) {
    toggled = {}
    setExpansion({ forSlug: selectedSlug, toggled })
  }

  const isExpanded = (id: string) => toggled[id] ?? ancestorIds.includes(id)

  const toggle = (id: string) =>
    setExpansion({
      forSlug: selectedSlug,
      toggled: { ...toggled, [id]: !isExpanded(id) },
    })

  const renderNodes = (nodes: CategoryNode[], depth: number) => (
    <ul className="space-y-0.5" role={depth === 0 ? "tree" : "group"}>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0
        const expanded = hasChildren && isExpanded(node.id)
        const selected = node.slug === selectedSlug

        return (
          <li key={node.id} role="treeitem" aria-expanded={hasChildren ? expanded : undefined} aria-selected={selected}>
            <div className="flex items-center gap-0.5" style={{ paddingLeft: `${depth * 0.75}rem` }}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggle(node.id)}
                  aria-label={`${expanded ? "Collapse" : "Expand"} ${node.nameEn}`}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted"
                >
                  <CaretRight
                    size={11}
                    weight="bold"
                    className={cn("transition-transform duration-150", expanded && "rotate-90")}
                  />
                </button>
              ) : (
                <span className="h-6 w-6 shrink-0" aria-hidden="true" />
              )}
              <button
                type="button"
                onClick={() => onSelect(node.slug)}
                aria-current={selected ? "true" : undefined}
                className={cn(
                  OPTION_BUTTON_BASE,
                  "min-w-0 flex-1",
                  selected ? OPTION_BUTTON_ACTIVE : OPTION_BUTTON_IDLE
                )}
              >
                <span className="truncate">{node.nameEn}</span>
                {selected && <Check size={12} weight="bold" className="shrink-0" />}
              </button>
            </div>
            {expanded && renderNodes(node.children, depth + 1)}
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-current={!selectedSlug ? "true" : undefined}
        className={cn(OPTION_BUTTON_BASE, !selectedSlug ? OPTION_BUTTON_ACTIVE : OPTION_BUTTON_IDLE)}
      >
        <span className="truncate">All Categories</span>
        {!selectedSlug && <Check size={12} weight="bold" className="shrink-0" />}
      </button>
      {renderNodes(roots, 0)}
    </div>
  )
}
