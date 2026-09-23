import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DEMO_ADMIN_USERS } from "@/features/admin/users/data/demo-admin-users"
import { UserIdentityCard } from "@/features/admin/users/components/user-identity-card"
import { UserDetailsPanel } from "@/features/admin/users/components/user-details-panel"

interface UserDetailPageProps {
  params: Promise<{
    userId: string
  }>
}

export async function generateMetadata({ params }: UserDetailPageProps): Promise<Metadata> {
  const { userId } = await params
  const user = DEMO_ADMIN_USERS.find((u) => u.id === userId)

  return {
    title: user ? `${user.name} (${user.id})` : "User Details",
    description: "Review marketplace user profile and seller history.",
  }
}

export default async function AdminUserDetailPage({ params }: UserDetailPageProps) {
  const { userId } = await params
  const user = DEMO_ADMIN_USERS.find((u) => u.id === userId) ?? DEMO_ADMIN_USERS[0]

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <UserIdentityCard user={user} />
      <UserDetailsPanel user={user} />
    </div>
  )
}
