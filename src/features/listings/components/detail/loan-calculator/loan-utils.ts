import type { LoanInputState, LoanCalculationResult, PaymentScheduleRow } from "./types"

export function calculateLoan(input: LoanInputState): LoanCalculationResult {
  const price = Math.max(0, input.price || 0)
  const downPayment = Math.min(price, Math.max(0, input.downPaymentAmount || 0))
  const loanAmount = Math.max(0, price - downPayment)

  const totalMonths = Math.max(
    1,
    Math.round(input.termUnit === "year" ? (input.term || 1) * 12 : input.term || 1)
  )

  const nominalRate = Math.max(0, input.rate || 0)

  if (loanAmount <= 0) {
    return {
      monthlyPayment: 0,
      downPayment,
      loanAmount: 0,
      totalInterest: 0,
      totalPayment: downPayment,
      totalMonths,
      schedule: [],
    }
  }

  if (input.loanType === "fixed") {
    const monthlyRate =
      input.rateUnit === "annual" ? nominalRate / 100 / 12 : nominalRate / 100

    let monthlyPayment = 0
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / totalMonths
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths)
      monthlyPayment = (loanAmount * monthlyRate * factor) / (factor - 1)
    }

    const schedule: PaymentScheduleRow[] = []
    let currentBalance = loanAmount
    let accumulatedInterest = 0

    for (let m = 1; m <= totalMonths; m++) {
      const interestForMonth = currentBalance * monthlyRate
      let principalForMonth = monthlyPayment - interestForMonth

      if (m === totalMonths || principalForMonth > currentBalance) {
        principalForMonth = currentBalance
      }

      currentBalance = Math.max(0, currentBalance - principalForMonth)
      accumulatedInterest += interestForMonth

      schedule.push({
        month: m,
        payment: principalForMonth + interestForMonth,
        interest: interestForMonth,
        principal: principalForMonth,
        balance: currentBalance,
      })
    }

    const totalInterest = accumulatedInterest
    const totalPayment = loanAmount + totalInterest + downPayment

    return {
      monthlyPayment,
      downPayment,
      loanAmount,
      totalInterest,
      totalPayment,
      totalMonths,
      schedule,
    }
  }

  const annualRateFraction =
    input.rateUnit === "annual" ? nominalRate / 100 : (nominalRate * 12) / 100

  const years = totalMonths / 12
  const totalInterest = loanAmount * annualRateFraction * years
  const monthlyPayment = (loanAmount + totalInterest) / totalMonths
  const monthlyInterest = totalInterest / totalMonths
  const monthlyPrincipal = loanAmount / totalMonths
  const totalPayment = loanAmount + totalInterest + downPayment

  const schedule: PaymentScheduleRow[] = []
  let balance = loanAmount

  for (let m = 1; m <= totalMonths; m++) {
    const isLast = m === totalMonths
    const principalPaid = isLast ? balance : monthlyPrincipal
    balance = Math.max(0, balance - principalPaid)

    schedule.push({
      month: m,
      payment: isLast ? principalPaid + monthlyInterest : monthlyPayment,
      interest: monthlyInterest,
      principal: principalPaid,
      balance,
    })
  }

  return {
    monthlyPayment,
    downPayment,
    loanAmount,
    totalInterest,
    totalPayment,
    totalMonths,
    schedule,
  }
}

export function getDefaultLoanInput(price: number): LoanInputState {
  const safePrice = Math.max(0, price || 10000)
  const defaultDownPercent = 20
  const defaultDownAmount = Math.round((safePrice * defaultDownPercent) / 100)

  return {
    price: safePrice,
    downPaymentAmount: defaultDownAmount,
    downPaymentPercent: defaultDownPercent,
    term: 5,
    termUnit: "year",
    rate: 8.5,
    rateUnit: "annual",
    loanType: "fixed",
  }
}
