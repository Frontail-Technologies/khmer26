 export type VerificationStatus = "pending" | "in_review" | "approved" | "rejected"

export type VerificationType = "identity" | "business" | "dealer"

export type VerificationSellerType = "individual" | "business" | "dealer"

export type VerificationDocumentType =
  | "national_id_front"
  | "national_id_back"
  | "passport"
  | "business_license"
  | "registration_certificate"
  | "dealer_license"

export interface VerificationDocument {
  id: string
  type: VerificationDocumentType
  title: string
  fileUrl: string
  fileSize: string
  fileType: string
  uploadedAt: string
  status: "submitted" | "reviewed" | "needs_resubmission"
}

export interface VerificationSellerSummary {
  id: string
  name: string
  avatar?: string
  email: string
  phone: string
  sellerType: VerificationSellerType
  location: string
  joinedDate: string
  activeListings: number
  slug?: string
}

export interface VerificationIdentityDetails {
  fullName: string
  idType: string
  idNumber: string
  dob?: string
  nationality?: string
  expiryDate?: string
}

export interface VerificationBusinessDetails {
  businessName: string
  registrationNumber: string
  taxNumber?: string
  registeredAddress: string
  ownerName: string
  businessCategory?: string
}

export interface VerificationAuditEvent {
  id: string
  action: string
  actor: string
  actorAvatar?: string
  timestamp: string
  note?: string
  type: "status_change" | "assignment" | "document_reviewed" | "submission" | "note"
}

export interface VerificationRequest {
  id: string
  seller: VerificationSellerSummary
  type: VerificationType
  status: VerificationStatus
  submittedAt: string
  submittedDate: string
  updatedAt: string
  assignedTo?: string
  assignedToAvatar?: string
  documents: VerificationDocument[]
  identityDetails?: VerificationIdentityDetails
  businessDetails?: VerificationBusinessDetails
  history: VerificationAuditEvent[]
  riskScore?: "low" | "medium" | "high"
  rejectionReason?: string
  rejectionNote?: string
}

export interface VerificationMetrics {
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  inReviewCount: number
  avgReviewTime: string
}
