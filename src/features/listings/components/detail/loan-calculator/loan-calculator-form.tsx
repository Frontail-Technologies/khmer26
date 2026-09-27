"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { LoanInputState, TermUnit, RateUnit, LoanType } from "./types"

interface LoanCalculatorFormProps {
  input: LoanInputState
  onChange: (updater: (prev: LoanInputState) => LoanInputState) => void
  currency?: string
}

export function LoanCalculatorForm({
  input,
  onChange,
  currency = "$",
}: LoanCalculatorFormProps) {
  const handlePriceChange = (val: string) => {
    const num = Math.max(0, parseFloat(val) || 0)
    onChange((prev) => {
      const newAmount = Math.round((num * prev.downPaymentPercent) / 100)
      return {
        ...prev,
        price: num,
        downPaymentAmount: newAmount,
      }
    })
  }

  const handleDownAmountChange = (val: string) => {
    const amount = Math.max(0, parseFloat(val) || 0)
    onChange((prev) => {
      const safePrice = prev.price > 0 ? prev.price : 1
      const percent = Math.min(100, Math.max(0, Math.round((amount / safePrice) * 100)))
      return {
        ...prev,
        downPaymentAmount: amount,
        downPaymentPercent: percent,
      }
    })
  }

  const handleDownPercentChange = (val: string) => {
    const percent = Math.min(100, Math.max(0, parseFloat(val) || 0))
    onChange((prev) => {
      const amount = Math.round((prev.price * percent) / 100)
      return {
        ...prev,
        downPaymentPercent: percent,
        downPaymentAmount: amount,
      }
    })
  }

  const handleTermChange = (val: string) => {
    const term = Math.max(1, parseInt(val, 10) || 1)
    onChange((prev) => ({ ...prev, term }))
  }

  const handleTermUnitChange = (unit: TermUnit) => {
    onChange((prev) => {
      if (prev.termUnit === unit) return prev
      const newTerm =
        unit === "month" ? Math.max(1, prev.term * 12) : Math.max(1, Math.round(prev.term / 12))
      return {
        ...prev,
        term: newTerm,
        termUnit: unit,
      }
    })
  }

  const handleRateChange = (val: string) => {
    const rate = Math.max(0, parseFloat(val) || 0)
    onChange((prev) => ({ ...prev, rate }))
  }

  const handleRateUnitChange = (unit: RateUnit) => {
    onChange((prev) => {
      if (prev.rateUnit === unit) return prev
      const newRate =
        unit === "monthly" ? Number((prev.rate / 12).toFixed(2)) : Number((prev.rate * 12).toFixed(1))
      return {
        ...prev,
        rate: newRate,
        rateUnit: unit,
      }
    })
  }

  const handleLoanTypeChange = (type: LoanType) => {
    onChange((prev) => ({ ...prev, loanType: type }))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="loan-price" className="text-xs font-bold text-foreground flex items-center gap-1">
          Price <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
            {currency}
          </span>
          <Input
            id="loan-price"
            type="number"
            min="0"
            step="100"
            value={input.price || ""}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="pl-7 text-xs sm:text-sm font-semibold h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-foreground">
          Down Payment
        </Label>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
              {currency}
            </span>
            <Input
              type="number"
              min="0"
              step="100"
              value={input.downPaymentAmount || ""}
              onChange={(e) => handleDownAmountChange(e.target.value)}
              aria-label="Down payment amount in currency"
              className="pl-7 text-xs sm:text-sm font-semibold h-10 rounded-xl"
            />
          </div>

          <div className="relative">
            <Input
              type="number"
              min="0"
              max="100"
              value={input.downPaymentPercent || ""}
              onChange={(e) => handleDownPercentChange(e.target.value)}
              aria-label="Down payment percentage"
              className="pr-7 text-xs sm:text-sm font-semibold h-10 rounded-xl text-right"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="loan-term" className="text-xs font-bold text-foreground flex items-center gap-1">
            Term <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="loan-term"
              type="number"
              min="1"
              max="360"
              value={input.term || ""}
              onChange={(e) => handleTermChange(e.target.value)}
              className="flex-1 text-xs sm:text-sm font-semibold h-10 rounded-xl"
            />
            <div className="flex bg-muted/60 p-1 rounded-xl border border-border/60 shrink-0">
              <button
                type="button"
                onClick={() => handleTermUnitChange("year")}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer",
                  input.termUnit === "year"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                year
              </button>
              <button
                type="button"
                onClick={() => handleTermUnitChange("month")}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer",
                  input.termUnit === "month"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                month
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="loan-rate" className="text-xs font-bold text-foreground flex items-center gap-1">
            Interest Rate
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="loan-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={input.rate || ""}
                onChange={(e) => handleRateChange(e.target.value)}
                className="pr-7 text-xs sm:text-sm font-semibold h-10 rounded-xl"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                %
              </span>
            </div>
            <div className="flex bg-muted/60 p-1 rounded-xl border border-border/60 shrink-0">
              <button
                type="button"
                onClick={() => handleRateUnitChange("annual")}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer",
                  input.rateUnit === "annual"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Annual
              </button>
              <button
                type="button"
                onClick={() => handleRateUnitChange("monthly")}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer",
                  input.rateUnit === "monthly"
                    ? "bg-card text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <Label className="text-xs font-bold text-foreground">
          Loan Type
        </Label>
        <div className="grid grid-cols-2 gap-2 bg-muted/60 p-1 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => handleLoanTypeChange("fixed")}
            className={cn(
              "py-2 px-3 text-xs font-bold rounded-lg transition-all text-center cursor-pointer",
              input.loanType === "fixed"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Fixed (Reducing)
          </button>
          <button
            type="button"
            onClick={() => handleLoanTypeChange("flat")}
            className={cn(
              "py-2 px-3 text-xs font-bold rounded-lg transition-all text-center cursor-pointer",
              input.loanType === "flat"
                ? "bg-card text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Flat
          </button>
        </div>
      </div>
    </div>
  )
}
