"use client"

import { useTheme } from "next-themes"
import {
  Sun,
  Moon,
  Desktop,
  Translate,
  Palette,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface AppearanceSettingsProps {
  language: "en" | "km"
  onLanguageChange: (lang: "en" | "km") => void
}

export function AppearanceSettings({
  language,
  onLanguageChange,
}: AppearanceSettingsProps) {
  const { theme, setTheme } = useTheme()

  const themes = [
    { id: "system", label: "System", icon: Desktop },
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
  ]

  return (
    <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs">
      <CardHeader className="p-0 pb-5">
        <div className="flex items-center gap-2 text-primary">
          <Palette size={20} weight="fill" />
          <CardTitle className="text-base font-bold text-foreground">
            Appearance & Language
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Customize your interface theme and language preferences.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground block">
            Color Theme
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {themes.map((item) => {
              const Icon = item.icon
              const isSelected = theme === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all select-none text-xs font-bold",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                      : "border-border/80 bg-background text-muted-foreground hover:border-border hover:text-foreground"
                  )}
                >
                  <Icon size={20} weight={isSelected ? "fill" : "regular"} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0 mt-0.5">
              <Translate size={18} />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-foreground block">
                Display Language
              </span>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                Choose between English and Khmer interface language.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-44">
            <Select
              value={language}
              onValueChange={(val) => onLanguageChange(val as "en" | "km")}
            >
              <SelectTrigger className="h-9 text-xs sm:text-sm bg-background">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en" className="text-xs">
                  English (US)
                </SelectItem>
                <SelectItem value="km" className="text-xs">
                  ភាសាខ្មែរ (Khmer)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
