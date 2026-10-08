"use client"

import {
  Suspense,
  useState,
  useRef,
  useEffect,
  useMemo,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { CaretDown, Check, MagnifyingGlass, SquaresFour, Tag } from "@phosphor-icons/react"
import { useCategoryTree } from "@/features/categories/api/categories.queries"
import type { CategoryNode } from "@/features/categories/api/categories.api"
import {
  buildCategoryIndex,
  getCategoryHref,
  getCategoryPath,
} from "@/features/categories/lib/category-tree"
import { useSearchSuggestions } from "@/features/search/hooks/use-search-suggestions"
import { formatPriceWithCurrency } from "@/lib/formatters/currency"

interface SearchBarProps {
  placeholder?: string
  defaultValue?: string
  onSearch?: (query: string, category?: string) => void
  className?: string
  size?: "sm" | "md" | "lg"
}

interface InnerProps extends SearchBarProps {
  urlQuery: string
  urlCategory?: string
}

type Suggestion =
  | { kind: "category"; id: string; label: string; context: string; href: string }
  | { kind: "listing"; id: string; label: string; context: string; href: string }

function CategoryThumb({ node, size }: { node: CategoryNode; size: number }) {
  const url = getMediaUrl(node.imageR2Key)
  if (url) {
    return (
      <Image
        src={url}
        alt=""
        width={size}
        height={size}
        loading="eager"
        className="shrink-0 rounded bg-muted object-cover"
        style={{ width: size, height: size }}
      />
    )
  }
  return <Tag size={size - 4} weight="regular" className="shrink-0 text-primary/80" aria-hidden="true" />
}

function CategoryOptions({
  nodes,
  depth,
  selectedSlug,
  onSelect,
}: {
  nodes: CategoryNode[]
  depth: number
  selectedSlug?: string
  onSelect: (node: CategoryNode) => void
}) {
  return (
    <ul className="space-y-0.5" role="group">
      {nodes.map((node) => {
        const selected = selectedSlug === node.slug
        return (
          <li key={node.id}>
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelect(node)}
              style={{ paddingLeft: `${0.625 + depth * 0.9}rem` }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md py-1.5 pr-2.5 text-xs transition-colors hover:bg-muted text-left",
                depth === 0 ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
                selected && "bg-primary/10 text-primary font-semibold"
              )}
            >
              <CategoryThumb node={node} size={depth === 0 ? 22 : 18} />
              <span className="flex-1 truncate">{node.nameEn}</span>
              {selected && <Check size={12} weight="bold" className="shrink-0" />}
            </button>
            {node.children.length > 0 && (
              <CategoryOptions
                nodes={node.children}
                depth={depth + 1}
                selectedSlug={selectedSlug}
                onSelect={onSelect}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}

function SearchBarInner({
  placeholder = "What are you looking for...",
  defaultValue = "",
  onSearch,
  className,
  size = "md",
  urlQuery,
  urlCategory,
}: InnerProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  // undefined = follow the URL; a value is a pending pick in the dropdown (resets when the URL changes).
  const [pick, setPick] = useState<string | null | undefined>(undefined)
  const [inputValue, setInputValue] = useState(urlQuery || defaultValue)
  const [suggestOpen, setSuggestOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedSlug = pick === undefined ? urlCategory : (pick ?? undefined)

  const tree = useCategoryTree()
  const index = useMemo(() => (tree.data ? buildCategoryIndex(tree.data) : null), [tree.data])
  const selectedNode = selectedSlug ? index?.bySlug.get(selectedSlug) : undefined

  const suggestions = useSearchSuggestions({ query: inputValue, categorySlug: selectedSlug, index })

  const items = useMemo<Suggestion[]>(() => {
    if (!index) return []
    const categoryItems: Suggestion[] = suggestions.categories.map(({ node, path }) => ({
      kind: "category",
      id: node.id,
      label: node.nameEn,
      context: path.slice(0, -1).map((p) => p.nameEn).join(" › "),
      href: getCategoryHref(path),
    }))
    const listingItems: Suggestion[] = suggestions.listings.map((listing) => ({
      kind: "listing",
      id: listing.id,
      label: listing.title,
      context:
        listing.price !== null && listing.currency
          ? `${formatPriceWithCurrency(Number(listing.price), listing.currency)} · ${listing.location.province.nameEn}`
          : listing.location.province.nameEn,
      href: `/listing/${listing.id}`,
    }))
    return [...categoryItems, ...listingItems]
  }, [index, suggestions.categories, suggestions.listings])

  const showSuggestions = suggestOpen && suggestions.eligible && (items.length > 0 || suggestions.isLoading)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSuggestOpen(false)
      }
    }
    if (isOpen || suggestOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, suggestOpen])

  function handleSelectCategory(node: CategoryNode | null) {
    setPick(node ? node.slug : null)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  function goTo(item: Suggestion) {
    setSuggestOpen(false)
    setActiveIndex(-1)
    router.push(item.href)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuggestOpen(false)
    const query = inputValue.trim()
    if (onSearch) {
      onSearch(query, selectedSlug)
      return
    }

    if (query) {
      const params = new URLSearchParams({ q: query })
      if (selectedSlug) params.set("category", selectedSlug)
      router.push(`/search?${params.toString()}`)
    } else if (selectedNode && index) {
      router.push(getCategoryHref(getCategoryPath(index, selectedNode)))
    } else {
      router.push("/search")
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setSuggestOpen(false)
      setActiveIndex(-1)
      return
    }
    if (!items.length) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSuggestOpen(true)
      setActiveIndex((i) => (i + 1) % items.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSuggestOpen(true)
      setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1))
    } else if (e.key === "Enter" && showSuggestions && activeIndex >= 0 && items[activeIndex]) {
      e.preventDefault()
      goTo(items[activeIndex]!)
    }
  }

  const listId = "header-search-suggestions"

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex w-full items-center rounded-lg border border-border bg-card shadow-xs transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          {
            "h-9 text-xs": size === "sm",
            "h-10 text-sm": size === "md",
            "h-12 text-base": size === "lg",
          }
        )}
        role="search"
      >
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev)
            setSuggestOpen(false)
          }}
          className="flex h-full shrink-0 items-center gap-1.5 px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 rounded-l-lg focus:outline-none"
          aria-expanded={isOpen}
          aria-label="Select category"
        >
          <span className="max-w-27.5 sm:max-w-32.5 truncate">
            {selectedNode ? selectedNode.nameEn : "All Categories"}
          </span>
          <CaretDown
            size={12}
            weight="bold"
            className={cn(
              "text-muted-foreground transition-transform duration-200 shrink-0",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <div className="h-5 w-px bg-border shrink-0" />

        <input
          ref={inputRef}
          type="search"
          name="q"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setSuggestOpen(true)
            setActiveIndex(-1)
            setIsOpen(false)
          }}
          onFocus={() => setSuggestOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search listings"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          autoComplete="off"
          className="flex-1 h-full min-w-0 border-0 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
        />

        <button
          type="submit"
          className="inline-flex h-full w-10 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-primary focus:outline-none"
          aria-label="Submit search"
        >
          <MagnifyingGlass size={size === "lg" ? 22 : 18} weight="bold" aria-hidden="true" />
        </button>
      </form>

      {showSuggestions && (
        <div
          id={listId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-96 overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-xl text-popover-foreground"
        >
          {(["category", "listing"] as const).map((kind) => {
            const group = items
              .map((item, i) => ({ item, i }))
              .filter(({ item }) => item.kind === kind)
            if (group.length === 0) return null
            return (
              <div key={kind} role="group" aria-label={kind === "category" ? "Categories" : "Listings"}>
                <div className="px-2.5 pb-0.5 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {kind === "category" ? "Categories" : "Listings"}
                </div>
                {group.map(({ item, i }) => (
                  <button
                    key={`${item.kind}-${item.id}`}
                    id={`${listId}-${i}`}
                    type="button"
                    role="option"
                    aria-selected={i === activeIndex}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => goTo(item)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                      i === activeIndex ? "bg-muted" : "hover:bg-muted"
                    )}
                  >
                    {item.kind === "category" ? (
                      <Tag size={14} className="shrink-0 text-primary/80" aria-hidden="true" />
                    ) : (
                      <MagnifyingGlass size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-foreground">{item.label}</span>
                      {item.context && (
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {item.context}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )
          })}
          {suggestions.isLoading && (
            <div className="px-2.5 py-1.5 text-[11px] text-muted-foreground" aria-live="polite">
              Searching…
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 w-72 sm:w-80 max-h-105 overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-xl text-popover-foreground animate-in fade-in-0 zoom-in-95"
          role="listbox"
          aria-label="Categories"
        >
          <button
            type="button"
            role="option"
            aria-selected={!selectedSlug}
            onClick={() => handleSelectCategory(null)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted text-left",
              !selectedSlug && "bg-primary/10 text-primary"
            )}
          >
            <SquaresFour size={16} weight="bold" className="shrink-0" />
            <span className="flex-1">All Categories</span>
            {!selectedSlug && <Check size={12} weight="bold" className="shrink-0" />}
          </button>

          <div className="my-1 h-px bg-border" />

          {tree.isPending ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">Loading categories…</p>
          ) : tree.isError ? (
            <p className="px-3 py-2 text-xs text-destructive">Couldn&apos;t load categories.</p>
          ) : (
            <CategoryOptions
              nodes={tree.data ?? []}
              depth={0}
              selectedSlug={selectedSlug}
              onSelect={handleSelectCategory}
            />
          )}
        </div>
      )}
    </div>
  )
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function SearchBarWithUrl(props: SearchBarProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const onSearchPage = pathname === "/search"
  const onCategoryPage = pathname.startsWith("/category/")
  const routeCategory = onCategoryPage ? safeDecode(pathname.split("/").filter(Boolean).pop() ?? "") : undefined

  const urlQuery = onSearchPage || onCategoryPage ? (searchParams.get("q") ?? "") : ""
  const urlCategory = onSearchPage ? (searchParams.get("category") ?? undefined) : routeCategory

  return (
    <SearchBarInner
      key={`${pathname}|${urlQuery}|${urlCategory ?? ""}`}
      {...props}
      urlQuery={urlQuery}
      urlCategory={urlCategory}
    />
  )
}

export function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={<SearchBarInner {...props} urlQuery="" />}>
      <SearchBarWithUrl {...props} />
    </Suspense>
  )
}
