import type { Metadata } from "next"
import { UserDetailWorkspace } from "@/features/admin/users/components/user-detail-workspace"

interface UserDetailPageProps {
  params: Promise<{
    userId: string
  }>
}

export async function generateMetadata({ params }: UserDetailPageProps): Promise<Metadata> {
  const { userId } = await params

  return {
    title: `User Details | ${userId}`,
    description: "Manage account information and access.",
  }
}

export default async function AdminUserDetailPage({ params }: UserDetailPageProps) {
  const { userId } = await params

  return <UserDetailWorkspace userId={userId} />
}
