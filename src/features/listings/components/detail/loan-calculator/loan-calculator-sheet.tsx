"use client"

import { useState, useMemo } from "react"
import { CaretLeft } from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoanCalculatorForm } from "./loan-calculator-form"
import { LoanCalculatorDonut } from "./loan-calculator-donut"
import { PaymentScheduleTable } from "./payment-schedule-table"
import { calculateLoan, getDefaultLoanInput } from "./loan-utils"
import type { LoanInputState } from "./types"

interface LoanCalculatorSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialPrice: number
  currency?: string
}

export function LoanCalculatorSheet({
  open,
  onOpenChange,
  initialPrice,
  currency = "USD",
}: LoanCalculatorSheetProps) {
  const [input, setInput] = useState<LoanInputState>(() =>
    getDefaultLoanInput(initialPrice)
  )

  const result = useMemo(() => calculateLoan(input), [input])

  const handleReset = () => {
    setInput(getDefaultLoanInput(initialPrice))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 top-0 left-0 translate-x-0 translate-y-0 w-full h-[100dvh] max-w-full max-h-[100dvh] rounded-none border-0 p-0 flex flex-col bg-card shadow-2xl overflow-hidden sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-xl sm:h-auto sm:max-h-[85dvh] sm:rounded-2xl sm:border sm:border-border/80"
      >
        <DialogHeader className="p-4 sm:p-5 bg-primary text-primary-foreground flex flex-row items-center justify-between shrink-0 space-y-0 select-none pt-[calc(1rem+env(safe-area-inset-top,0px))] sm:pt-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-1.5 -ml-1.5 rounded-lg text-primary-foreground/90 hover:text-primary-foreground hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Back to listing"
            >
              <CaretLeft size={22} weight="bold" />
            </button>
            <DialogTitle className="text-base sm:text-lg font-bold text-primary-foreground tracking-tight">
              Loan Calculator
            </DialogTitle>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-3 text-xs font-bold text-primary-foreground hover:bg-white/15 hover:text-primary-foreground rounded-lg cursor-pointer"
          >
            Clear
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
          <LoanCalculatorForm
            input={input}
            onChange={setInput}
            currency={currency === "USD" ? "$" : `${currency} `}
          />

          <div className="space-y-3 pt-2 border-t border-border/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Calculation Summary
            </h3>
            <LoanCalculatorDonut result={result} input={input} currency={currency} />
          </div>

          <div className="pt-2 border-t border-border/60">
            <PaymentScheduleTable schedule={result.schedule} currency={currency} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
