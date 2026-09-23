"use client"

import { useState } from "react"
import { MapPin, CaretRight, MagnifyingGlass } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CambodiaProvince } from "../types"

interface ProvinceListSidebarProps {
  provinces: CambodiaProvince[]
  selectedId: string
  onSelect: (id: string) => void
}

export function ProvinceListSidebar({
  provinces,
  selectedId,
  onSelect,
}: ProvinceListSidebarProps) {
  const [search, setSearch] = useState("")

  const filteredProvinces = provinces.filter((p) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      (p.nameKhmer && p.nameKhmer.includes(q)) ||
      p.code.toLowerCase().includes(q)
    )
  })

  return (
    <Card className="p-3 bg-card border-0 rounded-xl shadow-2xs space-y-3">
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-foreground">Provinces & Capital</span>
          <span className="text-[10px] text-muted-foreground block">
            {provinces.length} Administrative Divisions
          </span>
        </div>
      </div>

      <div className="relative">
        <MagnifyingGlass
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          placeholder="Filter provinces..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-8 pl-8 pr-2.5 rounded-md bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="space-y-1 pt-1 max-h-[500px] overflow-y-auto">
        {filteredProvinces.map((prov) => {
          const isSelected = prov.id === selectedId

          return (
            <div
              key={prov.id}
              onClick={() => onSelect(prov.id)}
              className={cn(
                "p-2.5 rounded-lg cursor-pointer transition-all border-0 text-xs flex items-center justify-between gap-2",
                isSelected
                  ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                  : "bg-muted/20 hover:bg-muted/40 text-foreground"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={15} weight="duotone" className={isSelected ? "text-primary" : "text-muted-foreground"} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">{prov.name}</span>
                    {prov.nameKhmer && (
                      <span className="text-[10px] text-muted-foreground font-normal hidden sm:inline">
                        {prov.nameKhmer}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-normal block">
                    {prov.districts.length} Districts • {prov.listingCount.toLocaleString()} ads
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                  {prov.code}
                </Badge>
                <CaretRight size={12} className={cn("text-muted-foreground", isSelected && "text-primary")} />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
