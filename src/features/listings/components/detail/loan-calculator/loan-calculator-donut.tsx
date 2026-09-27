import { formatPriceWithCurrency } from "@/lib/formatters/currency"
import type { LoanCalculationResult, LoanInputState } from "./types"

interface LoanCalculatorDonutProps {
  result: LoanCalculationResult
  input: LoanInputState
  currency?: string
}

export function LoanCalculatorDonut({
  result,
  input,
  currency = "USD",
}: LoanCalculatorDonutProps) {
  const { downPayment, loanAmount, totalInterest, totalPayment, monthlyPayment, totalMonths } =
    result

  const safeTotal = totalPayment > 0 ? totalPayment : 1
  const downPct = Math.max(0, (downPayment / safeTotal) * 100)
  const loanPct = Math.max(0, (loanAmount / safeTotal) * 100)
  const interestPct = Math.max(0, (totalInterest / safeTotal) * 100)

  const radius = 64
  const strokeWidth = 20
  const circumference = 2 * Math.PI * radius

  const downOffset = 0
  const downLength = (downPct / 100) * circumference

  const loanOffset = -downLength
  const loanLength = (loanPct / 100) * circumference

  const interestOffset = -(downLength + loanLength)
  const interestLength = (interestPct / 100) * circumference

  const termDisplay =
    input.termUnit === "year"
      ? `${input.term} ${input.term === 1 ? "year" : "years"}`
      : `${totalMonths} ${totalMonths === 1 ? "month" : "months"}`

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 sm:p-5 rounded-2xl border border-border/80 bg-muted/20">
      <div className="relative size-44 sm:size-48 shrink-0 flex items-center justify-center">
        <svg className="size-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/60"
          />

          {downLength > 0 && (
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={`${downLength} ${circumference}`}
              strokeDashoffset={downOffset}
              className="text-success transition-all duration-300"
            />
          )}

          {loanLength > 0 && (
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={`${loanLength} ${circumference}`}
              strokeDashoffset={loanOffset}
              className="text-primary transition-all duration-300"
            />
          )}

          {interestLength > 0 && (
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={`${interestLength} ${circumference}`}
              strokeDashoffset={interestOffset}
              className="text-accent transition-all duration-300"
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 pointer-events-none">
          <span className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {formatPriceWithCurrency(Math.round(monthlyPayment), currency)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground leading-tight mt-0.5">
            Per month
            <br />
            over {termDisplay}
          </span>
        </div>
      </div>

      <div className="w-full sm:flex-1 space-y-2.5 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-success shrink-0" />
            <span className="text-muted-foreground font-medium">Down Payment:</span>
          </div>
          <span className="font-bold text-foreground">
            {formatPriceWithCurrency(Math.round(downPayment), currency)}
          </span>
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-primary shrink-0" />
            <span className="text-muted-foreground font-medium">Loan Amount:</span>
          </div>
          <span className="font-bold text-foreground">
            {formatPriceWithCurrency(Math.round(loanAmount), currency)}
          </span>
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-accent shrink-0" />
            <span className="text-muted-foreground font-medium">Total Interest:</span>
          </div>
          <span className="font-bold text-foreground">
            {formatPriceWithCurrency(Math.round(totalInterest), currency)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-foreground shrink-0" />
            <span className="text-foreground font-bold">Total Payment:</span>
          </div>
          <span className="font-black text-sm text-foreground">
            {formatPriceWithCurrency(Math.round(totalPayment), currency)}
          </span>
        </div>
      </div>
    </div>
  )
}
