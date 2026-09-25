"use client"

import { useState } from "react"
import { PencilSimple } from "@phosphor-icons/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import type { SubscriptionPlan } from "../types"

interface SubscriptionPlansTableProps {
  initialPlans: SubscriptionPlan[]
}

export function SubscriptionPlansTable({
  initialPlans,
}: SubscriptionPlansTableProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const [formName, setFormName] = useState("")
  const [formLimit, setFormLimit] = useState(10)
  const [formPrice, setFormPrice] = useState(0)
  const [formActive, setFormActive] = useState(true)

  const handleEditClick = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setFormName(plan.name)
    setFormLimit(plan.maxListings)
    setFormPrice(plan.price)
    setFormActive(plan.isActive)
    setEditDialogOpen(true)
  }

  const handleSavePlan = () => {
    if (!editingPlan) return
    setPlans((prev) =>
      prev.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              name: formName,
              maxListings: Number(formLimit),
              price: Number(formPrice),
              isActive: formActive,
            }
          : p
      )
    )
    setEditDialogOpen(false)
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto min-w-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 dark:bg-muted/90 hover:bg-muted/60 dark:hover:bg-muted/90 border-b border-border/80 select-none">
              <TableHead className="py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80">
                Plan
              </TableHead>
              <TableHead className="py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80">
                Listing Limit
              </TableHead>
              <TableHead className="py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80">
                Duration
              </TableHead>
              <TableHead className="py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80">
                Price
              </TableHead>
              <TableHead className="py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80">
                Active Merchants
              </TableHead>
              <TableHead className="py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80">
                Status
              </TableHead>
              <TableHead className="py-3 px-4 text-xs font-bold text-muted-foreground dark:text-foreground/80 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow
                key={plan.id}
                className="transition-colors hover:bg-muted/25 border-b border-border/60 h-14"
              >
                <TableCell className="py-3 px-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-xs text-foreground block">
                      {plan.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground block line-clamp-1">
                      {plan.description}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4 text-xs">
                  <span className="font-semibold text-foreground">
                    {plan.maxListings >= 500 ? "500 (Unlimited)" : `${plan.maxListings} listings`}
                  </span>
                </TableCell>
                <TableCell className="py-3 px-4 text-xs">
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {plan.billingInterval}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 px-4 text-xs">
                  <span className="font-bold text-xs text-foreground">
                    {plan.price === 0 ? "Free" : `$${plan.price} USD`}
                  </span>
                </TableCell>
                <TableCell className="py-3 px-4 text-xs">
                  <span className="text-muted-foreground">
                    {plan.subscribersCount.toLocaleString()} sellers
                  </span>
                </TableCell>
                <TableCell className="py-3 px-4 text-xs">
                  <StatusBadge
                    label={plan.isActive ? "Active" : "Paused"}
                    tone={plan.isActive ? "success" : "neutral"}
                    size="sm"
                  />
                </TableCell>
                <TableCell className="py-3 px-4 text-xs text-right">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleEditClick(plan)}
                    className="size-7 text-muted-foreground hover:text-foreground"
                    aria-label={`Edit ${plan.name}`}
                  >
                    <PencilSimple size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden divide-y divide-border/60">
        {plans.map((plan) => (
          <div key={plan.id} className="p-3.5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-xs text-foreground">{plan.name}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{plan.description}</p>
              </div>
              <StatusBadge
                label={plan.isActive ? "Active" : "Paused"}
                tone={plan.isActive ? "success" : "neutral"}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 rounded-lg bg-muted/40 border border-border/50 space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Listing Limit</span>
                <span className="font-semibold text-foreground">
                  {plan.maxListings >= 500 ? "500 (Unlimited)" : `${plan.maxListings} listings`}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-muted/40 border border-border/50 space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Price</span>
                <span className="font-bold text-foreground">
                  {plan.price === 0 ? "Free" : `$${plan.price} / mo`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/40">
              <span className="text-[11px] text-muted-foreground">
                {plan.subscribersCount.toLocaleString()} active sellers
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleEditClick(plan)}
                className="text-xs"
              >
                <PencilSimple size={12} className="mr-1" />
                Edit Plan
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Subscription Plan</DialogTitle>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">Plan Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Listing Limit</label>
                <input
                  type="number"
                  value={formLimit}
                  onChange={(e) => setFormLimit(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Price (USD)</label>
                <input
                  type="number"
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
              <span className="font-semibold text-foreground">Plan Enabled</span>
              <Switch
                checked={formActive}
                onCheckedChange={setFormActive}
                aria-label="Toggle plan active state"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSavePlan}
              className="text-xs bg-primary text-primary-foreground font-semibold"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
