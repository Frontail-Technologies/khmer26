"use client"

import { useState, useMemo } from "react"
import { Calculator, ArrowRight } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPriceWithCurrency } from "@/lib/formatters/currency"
import { calculateLoan, getDefaultLoanInput } from "./loan-utils"
import { LoanCalculatorSheet } from "./loan-calculator-sheet"

interface LoanCalculatorCardProps {
  price: number
  currency?: string
}

export function LoanCalculatorCard({
  price,
  currency = "USD",
}: LoanCalculatorCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const defaultInput = useMemo(() => getDefaultLoanInput(price), [price])
  const result = useMemo(() => calculateLoan(defaultInput), [defaultInput])

  if (!price || price <= 0) {
    return null
  }

  const radius = 32
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const safeTotal = result.totalPayment > 0 ? result.totalPayment : 1
  const downPct = (result.downPayment / safeTotal) * 100
  const loanPct = (result.loanAmount / safeTotal) * 100
  const interestPct = (result.totalInterest / safeTotal) * 100

  const downLength = (downPct / 100) * circumference
  const loanOffset = -downLength
  const loanLength = (loanPct / 100) * circumference
  const interestOffset = -(downLength + loanLength)
  const interestLength = (interestPct / 100) * circumference

  return (
    <>
      <Card size="sm">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-primary shrink-0" />
            <CardTitle className="text-base sm:text-lg font-bold text-foreground">
              Loan Calculator
            </CardTitle>
          </div>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Customize</span>
            <ArrowRight size={13} weight="bold" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/60">
            <div className="relative size-20 shrink-0 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-muted/60"
                />
                {downLength > 0 && (
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${downLength} ${circumference}`}
                    strokeDashoffset={0}
                    className="text-success"
                  />
                )}
                {loanLength > 0 && (
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${loanLength} ${circumference}`}
                    strokeDashoffset={loanOffset}
                    className="text-primary"
                  />
                )}
                {interestLength > 0 && (
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${interestLength} ${circumference}`}
                    strokeDashoffset={interestOffset}
                    className="text-accent"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 pointer-events-none">
                <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">
                  Est.
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <span className="text-[11px] text-muted-foreground font-medium block">
                Estimated Monthly Payment
              </span>
              <span className="text-lg sm:text-xl font-black text-foreground tracking-tight block">
                {formatPriceWithCurrency(Math.round(result.monthlyPayment), currency)}
                <span className="text-xs font-normal text-muted-foreground"> / month</span>
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Based on 20% down payment over 5 years (8.5% rate)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
              <span className="text-[10px] text-muted-foreground block">Down Payment</span>
              <span className="font-bold text-foreground block truncate">
                {formatPriceWithCurrency(Math.round(result.downPayment), currency)}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
              <span className="text-[10px] text-muted-foreground block">Loan Amount</span>
              <span className="font-bold text-foreground block truncate">
                {formatPriceWithCurrency(Math.round(result.loanAmount), currency)}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
              <span className="text-[10px] text-muted-foreground block">Total Interest</span>
              <span className="font-bold text-accent block truncate">
                {formatPriceWithCurrency(Math.round(result.totalInterest), currency)}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setSheetOpen(true)}
            className="w-full h-10 text-xs font-bold rounded-xl border-primary/30 text-primary hover:bg-primary/10 transition-colors"
          >
            <span>Open Loan Calculator & Schedule</span>
          </Button>
        </CardContent>
      </Card>

      <LoanCalculatorSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        initialPrice={price}
        currency={currency}
      />
    </>
  )
}
