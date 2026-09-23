"use client"

import { useState } from "react"
import {
  CaretUp,
  CaretDown,
  Eye,
  FloppyDisk,
  DeviceMobile,
  Desktop,
  Sparkle,
  GridFour,
  MapPin,
  ShieldCheck,
  Tag,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { HomepageSectionConfig } from "../types"

interface HomepageEditorProps {
  initialSections: HomepageSectionConfig[]
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  hero_slider: <Sparkle size={16} className="text-blue-500" />,
  categories_grid: <GridFour size={16} className="text-purple-500" />,
  featured_listings: <Tag size={16} className="text-amber-500" />,
  location_browser: <MapPin size={16} className="text-emerald-500" />,
  trust_banner: <ShieldCheck size={16} className="text-indigo-500" />,
  recent_listings: <Tag size={16} className="text-rose-500" />,
}

export function HomepageEditor({ initialSections }: HomepageEditorProps) {
  const [sections, setSections] = useState<HomepageSectionConfig[]>(initialSections)
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop")

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    )
  }

  const moveSection = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return
    }
    const newSections = [...sections]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    const temp = newSections[index]
    newSections[index] = newSections[targetIndex]
    newSections[targetIndex] = temp
    setSections(newSections)
  }

  const enabledSections = sections.filter((s) => s.isEnabled)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-card rounded-xl shadow-2xs">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-foreground block">
            Homepage Structure & Section Hierarchy
          </span>
          <span className="text-[11px] text-muted-foreground block">
            Toggle, reorder, and curate discovery blocks displayed on Khmer26.com homepage.
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center bg-muted/60 p-0.5 rounded-md border border-border/60">
            <Button
              variant={previewDevice === "desktop" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setPreviewDevice("desktop")}
              className="h-7 px-2 text-xs"
            >
              <Desktop size={13} className="mr-1" />
              Desktop
            </Button>
            <Button
              variant={previewDevice === "mobile" ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setPreviewDevice("mobile")}
              className="h-7 px-2 text-xs"
            >
              <DeviceMobile size={13} className="mr-1" />
              Mobile
            </Button>
          </div>

          <Button size="sm" className="h-8 text-xs">
            <FloppyDisk size={14} className="mr-1.5" />
            Save Layout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Active Layout Blocks ({enabledSections.length}/{sections.length})
          </div>

          {sections.map((section, idx) => (
            <Card
              key={section.id}
              className={cn(
                "p-3 transition-all rounded-xl border-0 text-xs",
                section.isEnabled
                  ? "bg-card shadow-2xs"
                  : "bg-muted/20 opacity-60"
              )}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-md bg-muted/60 border border-border/40 shrink-0 mt-0.5">
                    {SECTION_ICONS[section.type]}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground truncate">{section.title}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{section.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, "up")}
                    className="size-6 text-muted-foreground hover:text-foreground"
                    aria-label="Move section up"
                  >
                    <CaretUp size={12} weight="bold" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={idx === sections.length - 1}
                    onClick={() => moveSection(idx, "down")}
                    className="size-6 text-muted-foreground hover:text-foreground"
                    aria-label="Move section down"
                  >
                    <CaretDown size={12} weight="bold" />
                  </Button>
                  <Switch
                    checked={section.isEnabled}
                    onCheckedChange={() => toggleSection(section.id)}
                    aria-label="Toggle section enabled"
                    className="ml-1"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-7">
          <Card className="bg-card border-0 rounded-xl shadow-2xs overflow-hidden">
            <CardHeader className="py-2.5 px-4 bg-muted/40 border-b border-border/60 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Live Visual Mockup ({previewDevice.toUpperCase()})
                </span>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Realtime Preview
              </Badge>
            </CardHeader>
            <CardContent className="p-4 bg-muted/10">
              <div
                className={cn(
                  "mx-auto rounded-xl border border-border bg-background p-4 space-y-4 shadow-sm transition-all",
                  previewDevice === "mobile" ? "max-w-[340px]" : "w-full"
                )}
              >
                {enabledSections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-3 rounded-lg border border-dashed border-border bg-muted/20 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        {SECTION_ICONS[sec.type]}
                        {sec.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">#{sec.type}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{sec.subtitle}</p>
                  </div>
                ))}

                {enabledSections.length === 0 && (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    All homepage sections are disabled. Enable sections to preview.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
