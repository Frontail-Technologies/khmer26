"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PriceRangeFilterProps {
  minPrice?: number
  maxPrice?: number
  onChange: (min?: number, max?: number) => void
}

const MAX_LIMIT = 100000

const PRESETS = [
  { label: "Below $5,000", min: 0, max: 5000, count: "2,400+ items" },
  { label: "$5,000 – $15,000", min: 5000, max: 15000, count: "8,500+ items" },
  { label: "$15,000 – $30,000", min: 15000, max: 30000, count: "5,200+ items" },
  { label: "$30,000 – $60,000", min: 30000, max: 60000, count: "2,100+ items" },
  { label: "$60,000 and Above", min: 60000, max: MAX_LIMIT, count: "1,800+ items" },
]

const HISTOGRAM = [90, 72, 55, 38, 25, 18, 12, 8, 5, 3]

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeFilterProps) {
  const [prevMin, setPrevMin] = useState(minPrice)
  const [prevMax, setPrevMax] = useState(maxPrice)
  const [sliderMin, setSliderMin] = useState<number>(minPrice ?? 0)
  const [sliderMax, setSliderMax] = useState<number>(maxPrice ?? MAX_LIMIT)

  if (minPrice !== prevMin || maxPrice !== prevMax) {
    setPrevMin(minPrice)
    setPrevMax(maxPrice)
    setSliderMin(minPrice ?? 0)
    setSliderMax(maxPrice ?? MAX_LIMIT)
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), sliderMax - 2000)
    setSliderMin(Math.max(0, value))
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), sliderMin + 2000)
    setSliderMax(Math.min(MAX_LIMIT, value))
  }

  const handleApply = () => {
    const nextMin = sliderMin <= 0 ? undefined : sliderMin
    const nextMax = sliderMax >= MAX_LIMIT ? undefined : sliderMax
    onChange(nextMin, nextMax)
  }

  const handleSelectPreset = (min: number, max: number) => {
    setSliderMin(min)
    setSliderMax(max)
    const nextMin = min <= 0 ? undefined : min
    const nextMax = max >= MAX_LIMIT ? undefined : max
    onChange(nextMin, nextMax)
  }

  const minPercent = (sliderMin / MAX_LIMIT) * 100
  const maxPercent = (sliderMax / MAX_LIMIT) * 100

  return (
    <div className="space-y-3.5 text-xs">
      <div>
        <p className="text-[11px] text-muted-foreground mb-2">
          Choose from options below
        </p>
        <div className="space-y-1.5">
          {PRESETS.map((preset) => {
            const isSelected =
              (minPrice === undefined ? preset.min === 0 : minPrice === preset.min) &&
              (maxPrice === undefined ? preset.max === MAX_LIMIT : maxPrice === preset.max)
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(preset.min, preset.max)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary/20"
                    : "border-border/80 bg-background text-foreground hover:bg-muted/70"
                )}
              >
                <span>{preset.label}</span>
                <span
                  className={cn(
                    "text-[11px]",
                    isSelected ? "text-primary font-bold" : "text-muted-foreground"
                  )}
                >
                  {preset.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="pt-1">
        <p className="text-[11px] text-muted-foreground mb-2">
          Choose a range below
        </p>

        <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-1.5">
          <span>{sliderMin === 0 ? "0" : `$${sliderMin.toLocaleString()}`}</span>
          <span>
            {sliderMax >= MAX_LIMIT
              ? "$100,000+"
              : `$${sliderMax.toLocaleString()}`}
          </span>
        </div>

        <div className="relative pt-3 pb-2">
          <div className="flex items-end gap-1 h-9 px-1 mb-1">
            {HISTOGRAM.map((height, index) => {
              const barPercent = (index / HISTOGRAM.length) * 100
              const isInRange =
                barPercent >= minPercent - 5 && barPercent <= maxPercent + 5
              return (
                <div
                  key={index}
                  style={{ height: `${height}%` }}
                  className={cn(
                    "flex-1 rounded-t-xs transition-colors",
                    isInRange ? "bg-muted-foreground/50" : "bg-muted-foreground/15"
                  )}
                />
              )
            })}
          </div>

          <div className="relative h-1 w-full bg-border rounded-full my-2">
            <div
              className="absolute h-full bg-foreground rounded-full"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            />

            <input
              type="range"
              min={0}
              max={MAX_LIMIT}
              step={1000}
              value={sliderMin}
              onChange={handleMinChange}
              className="pointer-events-none absolute -top-2 left-0 w-full h-5 appearance-none bg-transparent z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:bg-card [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-xs [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:bg-card [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-xs"
            />
            <input
              type="range"
              min={0}
              max={MAX_LIMIT}
              step={1000}
              value={sliderMax}
              onChange={handleMaxChange}
              className="pointer-events-none absolute -top-2 left-0 w-full h-5 appearance-none bg-transparent z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:bg-card [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-xs [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:bg-card [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-end mt-3">
          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            className="h-7.5 px-3.5 text-xs font-semibold bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer shadow-none"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
