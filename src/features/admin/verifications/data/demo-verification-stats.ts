export interface VerificationStats {
  pending: number
  inReview: number
  approved30d: number
  rejected30d: number
  averageReviewMinutes: number
}

export const DEMO_VERIFICATION_STATS: VerificationStats = {
  pending: 5,
  inReview: 3,
  approved30d: 128,
  rejected30d: 14,
  averageReviewMinutes: 192,
}
