"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DEMO_CATEGORIES } from "@/features/categories/data/demo-categories"
import { LOCATIONS } from "@/lib/constants/site"
import { cn } from "@/lib/utils"
import { MagnifyingGlass, MapPin, SquaresFour } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

interface HeroSearchBarProps {
  className?: string
}

export function HeroSearchBar({ className }: HeroSearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("Phnom Penh")
  const [category, setCategory] = useState("all")

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) {
      params.set("q", query.trim())
    }
    if (location && location !== "All Cambodia") {
      params.set("location", location)
    }
    if (category && category !== "all") {
      params.set("category", category)
    }
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col sm:flex-row items-stretch gap-1.5 sm:gap-2 rounded-xl border border-border/80 bg-background/95 backdrop-blur-md p-1.5 shadow-xs",
        className
      )}
    >
      <div className="relative flex-1 flex items-center min-w-0">
        <MagnifyingGlass
          size={18}
          className="pointer-events-none absolute left-3 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cars, property, phones, electronics..."
          className="h-10 border-0 bg-transparent pl-9 text-xs sm:text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
        />
      </div>

      <div className="hidden sm:block w-px bg-border my-1.5" />

      <div className="relative flex items-center min-w-36">
        <MapPin
          size={16}
          className="pointer-events-none absolute left-2.5 text-muted-foreground"
          aria-hidden="true"
        />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Filter by location"
          className="h-10 w-full appearance-none rounded-md bg-transparent pl-8 pr-7 text-xs font-medium text-foreground cursor-pointer focus:outline-hidden"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc} className="bg-popover text-popover-foreground">
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden md:block w-px bg-border my-1.5" />

      <div className="hidden md:relative md:flex items-center min-w-36">
        <SquaresFour
          size={16}
          className="pointer-events-none absolute left-2.5 text-muted-foreground"
          aria-hidden="true"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="h-10 w-full appearance-none rounded-md bg-transparent pl-8 pr-7 text-xs font-medium text-foreground cursor-pointer focus:outline-hidden"
        >
          <option value="all" className="bg-popover text-popover-foreground">
            All Categories
          </option>
          {DEMO_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.slug} className="bg-popover text-popover-foreground">
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        size="sm"
        className="h-10 px-5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-xs shrink-0"
      >
        <MagnifyingGlass size={16} weight="bold" className="mr-1.5" />
        Search
      </Button>
    </form>
  )
}
