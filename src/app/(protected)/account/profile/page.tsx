import { Badge } from "@/components/ui/badge"
import { AccountPageHeader } from "@/features/account/components/account-page-header"
import { ProfileForm } from "@/features/account/profile/components/profile-form"
import { VerificationCard } from "@/features/account/profile/components/verification-card"
import { DEMO_ACCOUNT_PROFILE } from "@/features/account/data/demo-account-data"

export const metadata = {
  title: "Profile",
  description: "Manage your profile details and marketplace verification",
}

function calculateProfileCompletion(profile: typeof DEMO_ACCOUNT_PROFILE): number {
  const fields = [
    Boolean(profile.fullName),
    Boolean(profile.username),
    Boolean(profile.email),
    Boolean(profile.phone),
    Boolean(profile.province),
    Boolean(profile.bio),
    Boolean(profile.avatarUrl),
  ]
  const completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}

export default function AccountProfilePage() {
  const completionPercentage = calculateProfileCompletion(DEMO_ACCOUNT_PROFILE)

  return (
    <div className="space-y-5 sm:space-y-6">
      <AccountPageHeader
        title="Profile"
        description="Manage your personal information and seller profile."
        action={
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 text-xs font-bold px-2.5 py-1"
          >
            Profile {completionPercentage}% complete
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        <div className="lg:col-span-8">
          <ProfileForm initialProfile={DEMO_ACCOUNT_PROFILE} />
        </div>
        <div className="lg:col-span-4 lg:sticky lg:top-20">
          <VerificationCard profile={DEMO_ACCOUNT_PROFILE} />
        </div>
      </div>
    </div>
  )
}
