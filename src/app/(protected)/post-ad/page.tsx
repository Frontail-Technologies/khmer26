import { getTranslations } from "next-intl/server"
import { LocalizedText } from "@/components/i18n/localized-text"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { X } from "@phosphor-icons/react/dist/ssr"
import { Container } from "@/components/layout/Container"
import { PostAdWizard } from "@/features/post-ad/components/post-ad-wizard"
import { Button } from "@/components/ui/button"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.postAd")
  return {
    title: t("title"),
    description: t("description"),
  }
}

interface PostAdPageProps {
  searchParams: Promise<{ edit?: string }>
}

export default async function PostAdPage({ searchParams }: PostAdPageProps) {
  const { edit } = await searchParams
  const isEditing = Boolean(edit)
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur-md py-3 sm:py-3.5">
        <Container>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center shrink-0" aria-label="Khmer26 home">
              <Image
                src="/images/logo.png"
                alt="Khmer26"
                width={115}
                height={30}
                priority
                className="h-7 w-auto object-contain"
              />
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground gap-1.5 h-8 px-2.5"
              render={
                <Link href="/">
                  <X size={16} weight="bold" />
                  <span><LocalizedText id="exit" /></span>
                </Link>
              }
            />
          </div>
        </Container>
      </header>

      <div className="border-b border-border/60 bg-card py-4 sm:py-5">
        <Container>
          <div>
            <span className="text-xxs sm:text-xs font-bold uppercase tracking-wider text-primary">
              <LocalizedText id="sellerWizard" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {isEditing ? "Edit Listing" : "Create New Listing"}
            </h1>
          </div>
        </Container>
      </div>

      <Container className="py-6 sm:py-8">
        <PostAdWizard listingId={edit} />
      </Container>
    </div>
  )
}
