import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { X } from "@phosphor-icons/react/dist/ssr"
import { Container } from "@/components/layout/Container"
import { PostAdWizard } from "@/features/post-ad/components/post-ad-wizard"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Post an Ad — Khmer26",
  description: "Create and publish your marketplace listing in minutes on Khmer26.",
}

export default function PostAdPage() {
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
                  <span>Exit</span>
                </Link>
              }
            />
          </div>
        </Container>
      </header>

      <div className="border-b border-border/60 bg-card py-4 sm:py-5">
        <Container>
          <div className="space-y-0.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-primary">
              Seller Wizard
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Create New Listing
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Follow the guided steps to post your item on the marketplace
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-6 sm:py-8">
        <PostAdWizard />
      </Container>
    </div>
  )
}
