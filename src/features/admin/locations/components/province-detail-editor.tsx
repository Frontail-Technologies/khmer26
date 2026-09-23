"use client"

import { useState } from "react"
import { MapPin, Plus, Trash, FloppyDisk } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { CambodiaProvince } from "../types"

interface ProvinceDetailEditorProps {
  province: CambodiaProvince | null
}

export function ProvinceDetailEditor({ province }: ProvinceDetailEditorProps) {
  const [name, setName] = useState(province?.name ?? "")
  const [nameKhmer, setNameKhmer] = useState(province?.nameKhmer ?? "")
  const [postalCode, setPostalCode] = useState(province?.postalCode ?? "")

  if (!province) {
    return (
      <Card className="p-8 text-center text-xs text-muted-foreground bg-card border-0 rounded-xl shadow-2xs">
        Select a province from the sidebar to inspect districts.
      </Card>
    )
  }

  return (
    <Card className="bg-card border-0 rounded-xl shadow-2xs">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <MapPin size={14} />
            Division Details: {province.name} ({province.nameKhmer})
          </CardTitle>
          <span className="text-[10px] text-muted-foreground block">
            {province.type} • Postal Prefix: {province.postalCode} • {province.listingCount.toLocaleString()} ads
          </span>
        </div>

        <Button size="sm" className="h-8 text-xs">
          <FloppyDisk size={14} className="mr-1.5" />
          Save Changes
        </Button>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field className="gap-2">
            <FieldLabel>Province Name (English)</FieldLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-xs"
            />
          </Field>

          <Field className="gap-2">
            <FieldLabel>Name (Khmer)</FieldLabel>
            <Input
              value={nameKhmer}
              onChange={(e) => setNameKhmer(e.target.value)}
              className="h-8 text-xs font-medium"
            />
          </Field>

          <Field className="gap-2">
            <FieldLabel>Postal Code Prefix</FieldLabel>
            <Input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="h-8 text-xs font-mono"
            />
          </Field>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground block">
                Administrative Districts & Khans ({province.districts.length})
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Districts registered under {province.name}
              </span>
            </div>

            <Button size="xs" variant="outline" className="h-7 text-xs">
              <Plus size={12} className="mr-1" />
              Add District
            </Button>
          </div>

          <div className="space-y-2">
            {province.districts.map((dist) => (
              <div
                key={dist.id}
                className="p-3 rounded-lg bg-muted/30 border-0 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{dist.name}</span>
                    {dist.nameKhmer && (
                      <span className="text-[11px] text-muted-foreground">{dist.nameKhmer}</span>
                    )}
                    <Badge variant="outline" className="text-[9px] font-mono h-4">
                      Code {dist.code}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{dist.sangkatsCount} Communes / Sangkats</span>
                    <span>•</span>
                    <span className="font-medium text-foreground">{dist.listingCount.toLocaleString()} ads</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={dist.isActive ? "outline" : "secondary"} className="text-[10px] h-4.5">
                    {dist.isActive ? "Active" : "Disabled"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="size-7 text-muted-foreground hover:text-destructive"
                    aria-label="Remove district"
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
