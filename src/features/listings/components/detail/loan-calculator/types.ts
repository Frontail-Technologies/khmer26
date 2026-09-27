export type LoanType = "fixed" | "flat"

export type TermUnit = "year" | "month"

export type RateUnit = "annual" | "monthly"

export interface LoanInputState {
  price: number
  downPaymentAmount: number
  downPaymentPercent: number
  term: number
  termUnit: TermUnit
  rate: number
  rateUnit: RateUnit
  loanType: LoanType
}

export interface PaymentScheduleRow {
  month: number
  payment: number
  interest: number
  principal: number
  balance: number
}

export interface LoanCalculationResult {
  monthlyPayment: number
  downPayment: number
  loanAmount: number
  totalInterest: number
  totalPayment: number
  totalMonths: number
  schedule: PaymentScheduleRow[]
}
