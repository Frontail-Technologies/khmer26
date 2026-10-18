"use client"

import { LocalizedText } from "@/components/i18n/localized-text"

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
      <Card size="sm" className="rounded-md border border-border/70 shadow-none ring-0">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-primary shrink-0" />
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-foreground">
              <LocalizedText id="loanCalculator" />
            </CardTitle>
          </div>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
          >
            <span><LocalizedText id="customize" /></span>
            <ArrowRight size={13} weight="bold" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-md bg-muted/30 border border-border/60">
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
                <span className="text-2xs font-bold text-muted-foreground uppercase leading-none">
                  <LocalizedText id="est" />
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <span className="text-xxs text-muted-foreground font-medium block">
                <LocalizedText id="estimatedMonthlyPayment" />
              </span>
              <span className="text-lg sm:text-xl font-black text-foreground tracking-tight block">
                {formatPriceWithCurrency(Math.round(result.monthlyPayment), currency)}
                <span className="text-xs font-normal text-muted-foreground"> <LocalizedText id="month_f7fa5d" /></span>
              </span>
              <span className="text-2xs text-muted-foreground block">
                <LocalizedText id="basedOn20DownPaymentOver5Years8" />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
              <span className="text-2xs text-muted-foreground block"><LocalizedText id="downPayment" /></span>
              <span className="font-bold text-foreground block truncate">
                {formatPriceWithCurrency(Math.round(result.downPayment), currency)}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
              <span className="text-2xs text-muted-foreground block"><LocalizedText id="loanAmount_bed46a" /></span>
              <span className="font-bold text-foreground block truncate">
                {formatPriceWithCurrency(Math.round(result.loanAmount), currency)}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
              <span className="text-2xs text-muted-foreground block"><LocalizedText id="totalInterest" /></span>
              <span className="font-bold text-accent block truncate">
                {formatPriceWithCurrency(Math.round(result.totalInterest), currency)}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setSheetOpen(true)}
            className="w-full h-10 text-xs font-bold rounded-md border-primary/30 text-primary hover:bg-primary/10 transition-colors"
          >
            <span><LocalizedText id="openLoanCalculatorSchedule" /></span>
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
