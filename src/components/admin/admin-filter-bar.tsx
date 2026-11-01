"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { ArrowCounterClockwise, FadersHorizontal, MagnifyingGlass, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
  type SelectOption,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type Placement = "inline" | "sheet"
const PlacementContext = createContext<Placement>("inline")

interface AdminFilterBarProps {
  search?: { value: string; onChange: (value: string) => void; placeholder: string }
  /** Number of non-default filters (sort excluded); drives the badge and Reset. */
  activeCount: number
  onReset: () => void
  /** AdminFilterSelect elements. Rendered inline on desktop and inside a bottom sheet on phones. */
  children?: ReactNode
  /** Extra controls kept visible on every screen size (e.g. a view toggle). */
  trailing?: ReactNode
  className?: string
}

/**
 * One filter bar for every admin list: search + pill selects inline on desktop; on phones the
 * search stays visible and the selects move into a bottom sheet behind a counted filter button.
 */
export function AdminFilterBar({ search, activeCount, onReset, children, trailing, className }: AdminFilterBarProps) {
  const [open, setOpen] = useState(false)
  const hasFilters = Boolean(children)

  return (
    <div className={cn("flex items-center gap-2 border-b border-border/60 px-3 py-2.5 sm:px-4", className)}>
      {search && (
        <label className="relative min-w-0 flex-1 md:max-w-sm">
          <span className="sr-only">{search.placeholder}</span>
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search.value}
            onChange={(event) => search.onChange(event.target.value)}
            placeholder={search.placeholder}
            className="h-10 w-full rounded-full border border-border/70 bg-muted/40 pl-10 pr-9 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-3 focus:ring-primary/15 md:h-9 md:text-xs [&::-webkit-search-cancel-button]:hidden"
          />
          {search.value && (
            <button
              type="button"
              onClick={() => search.onChange("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
            >
              <X size={13} weight="bold" />
            </button>
          )}
        </label>
      )}

      {hasFilters && (
        <>
          <div className="hidden flex-wrap items-center gap-2 md:flex">
            <PlacementContext.Provider value="inline">{children}</PlacementContext.Provider>
            {activeCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-9 gap-1.5 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowCounterClockwise size={14} />
                Reset
              </Button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={activeCount > 0 ? `Filters (${activeCount} active)` : "Filters"}
            className={cn(
              "pressable relative flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors md:hidden",
              activeCount > 0
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border/70 bg-card text-foreground"
            )}
          >
            <FadersHorizontal size={18} weight={activeCount > 0 ? "fill" : "regular"} />
            {activeCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-3xs font-bold text-primary-foreground ring-2 ring-card">
                {activeCount}
              </span>
            )}
          </button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="bottom" className="rounded-t-3xl px-0 pb-[env(safe-area-inset-bottom,0px)] md:hidden">
              <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-muted-foreground/25" aria-hidden="true" />
              <SheetHeader className="px-5 pb-0 pt-1">
                <SheetTitle className="text-base font-bold">Filters</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3.5 overflow-y-auto px-5 py-2">
                <PlacementContext.Provider value="sheet">{children}</PlacementContext.Provider>
              </div>
              <SheetFooter className="flex-row gap-2 border-t border-border/60 px-5 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 flex-1 rounded-xl"
                  disabled={activeCount === 0}
                  onClick={onReset}
                >
                  Reset
                </Button>
                <Button type="button" className="h-11 flex-1 rounded-xl font-bold" onClick={() => setOpen(false)}>
                  Show results
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </>
      )}

      {trailing}
    </div>
  )
}

interface AdminFilterSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  /** The first option is treated as the "all" default. */
  options: ReadonlyArray<SelectOption>
  /** Desktop trigger width (Tailwind class). */
  widthClassName?: string
}

/** A filter dropdown that renders as a pill on desktop and a labelled full-width field in the sheet. */
export function AdminFilterSelect({ label, value, onChange, options, widthClassName = "w-40" }: AdminFilterSelectProps) {
  const placement = useContext(PlacementContext)
  const fallback = options[0]?.label ?? label
  const isDefault = value === (options[0]?.value ?? "")

  const select = (
    <Select items={[...options]} value={value} onValueChange={(next) => onChange((next as string) ?? options[0]?.value ?? "")}>
      <SelectTrigger
        size={placement === "sheet" ? "default" : "sm"}
        aria-label={label}
        className={cn(
          placement === "sheet"
            ? "h-11 w-full rounded-xl text-sm"
            : cn("h-9 rounded-full px-3.5 text-xs", widthClassName),
          !isDefault && placement === "inline" && "border-primary/40 bg-primary/5 text-primary"
        )}
      >
        <SelectValue placeholder={fallback}>{(selected) => getSelectOptionLabel(options, selected as string, fallback)}</SelectValue>
      </SelectTrigger>
      <SelectContent side="bottom" align="start">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={option.disabled} className="text-xs">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  if (placement === "inline") return select
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      {select}
    </div>
  )
}

interface AdminFilterFieldProps {
  label: string
  /** Non-select filter controls (text input, date range). */
  children: ReactNode
}

/** A labelled wrapper for non-select filters: rendered as-is inline, labelled and full-width in the sheet. */
export function AdminFilterField({ label, children }: AdminFilterFieldProps) {
  const placement = useContext(PlacementContext)
  if (placement === "inline") return <>{children}</>
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 [&_input]:h-11 [&_input]:w-auto [&_input]:min-w-0 [&_input]:flex-1 [&_input]:rounded-xl [&_input]:text-sm">
        {children}
      </div>
    </div>
  )
}
