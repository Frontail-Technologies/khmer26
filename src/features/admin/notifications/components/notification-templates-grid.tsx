"use client"

import { useState } from "react"
import { FileText } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { NotificationTemplate } from "../types"

interface NotificationTemplatesGridProps {
  templates: NotificationTemplate[]
}

const CATEGORY_BADGES: Record<string, "default" | "secondary" | "outline"> = {
  moderation: "secondary",
  transactional: "default",
  security: "outline",
  marketing: "secondary",
}

export function NotificationTemplatesGrid({ templates: initialTemplates }: NotificationTemplatesGridProps) {
  const [templates, setTemplates] = useState(initialTemplates)

  const toggleTemplate = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    )
  }

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="p-4 bg-card rounded-xl border-0 flex flex-col justify-between shadow-2xs text-xs">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  <span className="font-bold text-foreground">{tpl.name}</span>
                </div>
                <Badge variant={CATEGORY_BADGES[tpl.category] || "outline"} className="text-[10px] uppercase font-semibold">
                  {tpl.category}
                </Badge>
              </div>

              <span className="font-mono text-[10px] text-muted-foreground block bg-muted/60 px-1.5 py-0.5 rounded w-fit">
                {tpl.key}
              </span>

              <p className="text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-md border border-border/40 font-mono text-[11px]">
                {tpl.templateText}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-muted-foreground">Variables:</span>
                {tpl.variables.map((v) => (
                  <span key={v} className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.2 rounded">
                    {"{{" + v + "}}"}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-foreground">
                {tpl.isActive ? "Template Active" : "Template Inactive"}
              </span>
              <Switch
                checked={tpl.isActive}
                onCheckedChange={() => toggleTemplate(tpl.id)}
                aria-label="Toggle template status"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
