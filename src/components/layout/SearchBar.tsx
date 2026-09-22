"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { DEMO_CATEGORIES } from "@/features/categories/data/demo-categories"
import {
  Armchair,
  Bicycle,
  Briefcase,
  Buildings,
  Camera,
  CaretDown,
  CarProfile,
  DeviceMobile,
  DeviceTablet,
  GameController,
  GraduationCap,
  Headphones,
  House,
  Laptop,
  MagnifyingGlass,
  MapPin,
  Motorcycle,
  PawPrint,
  Plant,
  SquaresFour,
  Storefront,
  Tag,
  Truck,
  TShirt,
  Wrench,
} from "@phosphor-icons/react"

interface SelectedCategory {
  id: string
  name: string
  slug: string
}

interface SearchBarProps {
  placeholder?: string
  defaultValue?: string
  onSearch?: (query: string, category?: string) => void
  className?: string
  size?: "sm" | "md" | "lg"
}

function getCategoryIcon(id: string, isParent = false) {
  switch (id) {
    case "vehicles":
      return <CarProfile size={18} weight={isParent ? "fill" : "regular"} className="text-primary shrink-0" />
    case "vehicles-cars":
    case "vehicles-cars-suv":
    case "vehicles-cars-sedan":
    case "vehicles-cars-pickup":
    case "vehicles-cars-hatchback":
    case "vehicles-cars-van":
      return <CarProfile size={15} className="text-muted-foreground shrink-0" />
    case "vehicles-motorcycles":
      return <Motorcycle size={15} className="text-muted-foreground shrink-0" />
    case "vehicles-trucks":
      return <Truck size={15} className="text-muted-foreground shrink-0" />
    case "vehicles-parts":
      return <Wrench size={15} className="text-muted-foreground shrink-0" />
    case "property":
      return <Buildings size={18} weight={isParent ? "fill" : "regular"} className="text-primary shrink-0" />
    case "property-house":
      return <House size={15} className="text-muted-foreground shrink-0" />
    case "property-apartment":
      return <Buildings size={15} className="text-muted-foreground shrink-0" />
    case "property-land":
      return <MapPin size={15} className="text-muted-foreground shrink-0" />
    case "property-commercial":
      return <Storefront size={15} className="text-muted-foreground shrink-0" />
    case "electronics":
      return <DeviceMobile size={18} weight={isParent ? "fill" : "regular"} className="text-primary shrink-0" />
    case "electronics-phones":
    case "electronics-phones-smartphones":
    case "electronics-phones-feature":
      return <DeviceMobile size={15} className="text-muted-foreground shrink-0" />
    case "electronics-laptops":
      return <Laptop size={15} className="text-muted-foreground shrink-0" />
    case "electronics-cameras":
      return <Camera size={15} className="text-muted-foreground shrink-0" />
    case "electronics-audio":
      return <Headphones size={15} className="text-muted-foreground shrink-0" />
    case "electronics-tablets":
      return <DeviceTablet size={15} className="text-muted-foreground shrink-0" />
    case "electronics-gaming":
      return <GameController size={15} className="text-muted-foreground shrink-0" />
    case "jobs":
    case "jobs-fulltime":
    case "jobs-parttime":
    case "jobs-freelance":
      return <Briefcase size={15} className="text-muted-foreground shrink-0" />
    case "services":
    case "services-home":
    case "services-auto":
    case "services-tech":
    case "services-beauty":
      return <Wrench size={15} className="text-muted-foreground shrink-0" />
    case "fashion":
      return <TShirt size={18} weight={isParent ? "fill" : "regular"} className="text-primary shrink-0" />
    case "furniture":
      return <Armchair size={18} weight={isParent ? "fill" : "regular"} className="text-primary shrink-0" />
    case "animals":
      return <PawPrint size={18} weight={isParent ? "fill" : "regular"} className="text-primary shrink-0" />
    case "food":
      return <Plant size={18} weight={isParent ? "fill" : "regular"} className="text-primary shrink-0" />
    case "education":
      return <GraduationCap size={18} weight={isParent ? "fill" : "regular"} className="text-primary shrink-0" />
    case "sports":
      return <Bicycle size={18} weight={isParent ? "fill" : "regular"} className="text-primary shrink-0" />
    default:
      return <Tag size={15} className="text-muted-foreground shrink-0" />
  }
}

export function SearchBar({
  placeholder = "What are you looking for...",
  defaultValue = "",
  onSearch,
  className,
  size = "md",
}: SearchBarProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  function handleSelectCategory(cat: SelectedCategory | null) {
    setSelectedCategory(cat)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const query = inputRef.current?.value.trim() ?? ""
    if (onSearch) {
      onSearch(query, selectedCategory?.slug)
      return
    }

    if (query && selectedCategory) {
      router.push(`/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(selectedCategory.slug)}`)
    } else if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    } else if (selectedCategory) {
      router.push(`/category/${selectedCategory.slug}`)
    }
  }

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
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-full shrink-0 items-center gap-1.5 px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted/60 rounded-l-lg focus:outline-none"
          aria-expanded={isOpen}
          aria-label="Select category"
        >
          <span className="max-w-27.5 sm:max-w-32.5 truncate">
            {selectedCategory ? selectedCategory.name : "All Categories"}
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
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-label="Search listings"
          className="flex-1 h-full min-w-0 border-0 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
        />

        <button
          type="submit"
          className="inline-flex h-full w-10 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-primary focus:outline-none"
          aria-label="Submit search"
        >
          <MagnifyingGlass
            size={size === "lg" ? 22 : 18}
            weight="bold"
            aria-hidden="true"
          />
        </button>
      </form>

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 w-72 sm:w-80 max-h-105 overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-xl text-popover-foreground animate-in fade-in-0 zoom-in-95"
          role="listbox"
        >
          <button
            type="button"
            onClick={() => handleSelectCategory(null)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted text-left",
              !selectedCategory && "bg-primary/10 text-primary"
            )}
          >
            <SquaresFour size={16} weight="bold" className="shrink-0" />
            <span>All Categories</span>
          </button>

          <div className="my-1 h-px bg-border" />

          <div className="space-y-1">
            {DEMO_CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectCategory({
                      id: cat.id,
                      name: cat.name,
                      slug: cat.slug,
                    })
                  }
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted text-left",
                    selectedCategory?.id === cat.id && "bg-primary/10 text-primary"
                  )}
                >
                  {getCategoryIcon(cat.id, true)}
                  <span className="flex-1 truncate">{cat.name}</span>
                </button>

                {cat.children && cat.children.length > 0 && (
                  <div className="space-y-0.5 pl-4">
                    {cat.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() =>
                          handleSelectCategory({
                            id: child.id,
                            name: child.name,
                            slug: child.slug,
                          })
                        }
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground text-left",
                          selectedCategory?.id === child.id &&
                            "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        {getCategoryIcon(child.id, false)}
                        <span className="flex-1 truncate">{child.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
