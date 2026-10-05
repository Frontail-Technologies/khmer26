import type { Metadata } from "next"
import { VerificationDetailWorkspace } from "@/features/admin/verifications/components/verification-detail-workspace"

interface VerificationDetailPageProps {
  params: Promise<{ verificationId: string }>
}

export async function generateMetadata({ params }: VerificationDetailPageProps): Promise<Metadata> {
  const { verificationId } = await params
  return {
    title: `Verification Review #${verificationId}`,
    description: `Administrative verification review workspace for request #${verificationId}`,
  }
}

export default async function AdminVerificationDetailPage({ params }: VerificationDetailPageProps) {
  const { verificationId } = await params

  return <VerificationDetailWorkspace verificationId={verificationId} />
}
