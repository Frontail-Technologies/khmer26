"use client"

import { useState } from "react"
import { Sparkle, Star, Lightning, Info } from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AccountListingItem } from "../../types"

interface PromoteListingDialogProps {
  listing: AccountListingItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PROMO_OPTIONS = [
  {
    id: "featured",
    name: "Featured Listing",
    duration: "7 Days",
    price: "$15.00",
    description: "Pinned to homepage hero banner and category top spotlights for 5x more views.",
    icon: Sparkle,
  },
  {
    id: "top_listing",
    name: "Top Listing Boost",
    duration: "3 Days",
    price: "$6.00",
    description: "Stays above standard listings in search results and relevant category feeds.",
    icon: Star,
  },
  {
    id: "urgent",
    name: "Urgent Badge",
    duration: "48 Hours",
    price: "$3.00",
    description: "High-visibility red badge to alert active buyers looking for quick deals.",
    icon: Lightning,
  },
]

export function PromoteListingDialog({
  listing,
  open,
  onOpenChange,
}: PromoteListingDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState("featured")

  if (!listing) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent mb-1">
            <Sparkle size={22} weight="fill" />
          </div>
          <DialogTitle className="text-lg font-bold">
            Promote Listing
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Boost visibility and get buyer inquiries faster for &quot;{listing.title}&quot;.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {PROMO_OPTIONS.map((option) => {
            const Icon = option.icon
            const isSelected = selectedPlan === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedPlan(option.id)}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 select-none",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border/80 bg-card hover:border-border hover:bg-muted/30"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg shrink-0",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon size={20} weight={isSelected ? "fill" : "regular"} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-foreground">
                      {option.name}
                    </span>
                    <span className="font-black text-sm text-primary">
                      {option.price}{" "}
                      <span className="text-[11px] font-normal text-muted-foreground">
                        / {option.duration}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </button>
            )
          })}

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/60 border border-border/60 text-xs text-muted-foreground">
            <Info size={16} className="text-primary shrink-0 mt-0.5" />
            <p className="leading-normal">
              Promotion purchase will be available after payment gateway integration.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold h-10"
          >
            Close
          </Button>
          <Button
            type="button"
            disabled
            className="text-xs font-semibold h-10 bg-primary text-primary-foreground opacity-60 cursor-not-allowed"
          >
            Proceed to Payment (Integration Pending)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
