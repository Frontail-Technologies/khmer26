"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChatCircleDots,
  UserPlus,
  UserCheck,
  DotsThreeVertical,
  ShareNetwork,
  LinkSimple,
  Flag,
  Check,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { SellerReportDialog } from "./seller-report-dialog"
import type { SellerProfileDetail } from "../types"

interface SellerActionsProps {
  seller: SellerProfileDetail
}

export function SellerActions({ seller }: SellerActionsProps) {
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: seller.name,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          className="h-10 px-4 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs sm:text-sm rounded-lg shadow-sm gap-1.5"
          onClick={() => {
            router.push(`/messages?sellerId=${seller.id}`)
          }}
        >
          <ChatCircleDots size={18} weight="fill" />
          <span>Contact Seller</span>
        </Button>

        <Button
          variant={isFollowing ? "outline" : "secondary"}
          className={`h-10 px-3.5 text-xs sm:text-sm font-semibold rounded-lg gap-1.5 transition-colors ${
            isFollowing ? "border-primary text-primary hover:bg-primary/5" : ""
          }`}
          onClick={() => setIsFollowing((prev) => !prev)}
          aria-pressed={isFollowing}
        >
          {isFollowing ? (
            <>
              <UserCheck size={16} weight="bold" className="text-primary" />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus size={16} weight="bold" />
              <span>Follow</span>
            </>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="More seller options"
                className="h-10 w-10 border-border hover:bg-muted"
              >
                <DotsThreeVertical size={18} weight="bold" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleShare} className="gap-2 text-xs">
              <ShareNetwork size={16} />
              <span>Share Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleCopyLink} className="gap-2 text-xs">
              {copied ? (
                <Check size={16} className="text-primary" />
              ) : (
                <LinkSimple size={16} />
              )}
              <span>{copied ? "Link Copied!" : "Copy Profile Link"}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setReportOpen(true)}
              className="gap-2 text-xs text-destructive focus:text-destructive"
            >
              <Flag size={16} />
              <span>Report Seller</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SellerReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        sellerName={seller.name}
      />
    </>
  )
}
