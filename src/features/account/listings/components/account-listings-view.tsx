"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, ListBullets, MagnifyingGlass, BookmarkSimple, ShoppingBagOpen } from "@phosphor-icons/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { AccountPageHeader } from "../../components/account-page-header"
import { AccountListingCard } from "./account-listing-card"
import { AccountListingsToolbar, type ListingSortOption } from "./account-listings-toolbar"
import { PromoteListingDialog } from "./promote-listing-dialog"
import { DeleteListingDialog } from "./delete-listing-dialog"
import type { AccountListingItem, AccountListingFilterStatus, AccountListingStatus } from "../../types"
import { useAccountListings } from "../api/account-listings.queries"
import {
  useDeleteAccountListing,
  useMarkAccountListingSold,
  useReactivateAccountListing,
  useRenewAccountListing,
} from "../api/account-listings.mutations"
import { toast } from "sonner"
import { useCategoryTree } from "@/features/categories/api/categories.queries"
import { collectCategoryIds } from "@/features/categories/lib/category-tree"

export function AccountListingsView() {
  const tGenerated = useTranslations("generated")
  const t = useTranslations("ui.myListings")
  const { data: categoryTree = [] } = useCategoryTree()
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<AccountListingFilterStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortOption, setSortOption] = useState<ListingSortOption>("newest")
  const [promoteListing, setPromoteListing] = useState<AccountListingItem | null>(null)
  const [deleteListing, setDeleteListing] = useState<AccountListingItem | null>(null)

  const { data, isLoading, isError } = useAccountListings({ status: statusFilter })
  const markSold = useMarkAccountListingSold()
  const reactivate = useReactivateAccountListing()
  const renew = useRenewAccountListing()
  const removeListing = useDeleteAccountListing()
  const listings = useMemo(() => data?.items ?? [], [data?.items])

  const handleStatusChange = async (id: string, newStatus: AccountListingStatus) => {
    const listing = listings.find((item) => item.id === id)
    if (!listing) return

    try {
      if (newStatus === "sold") {
        await markSold.mutateAsync(id)
        toast.success(tGenerated("listingMarkedAsSold"))
      } else if (newStatus === "active") {
        if (listing.status === "expired") {
          await renew.mutateAsync(id)
          toast.success(tGenerated("listingRenewed"))
        } else {
          await reactivate.mutateAsync(id)
          toast.success(tGenerated("listingReactivated"))
        }
      }
    } catch {
      // Mutation hooks surface the API error toast.
    }
  }

  const handleDeleteConfirm = async (id: string) => {
    try {
      await removeListing.mutateAsync(id)
      toast.success(tGenerated("listingDeleted"))
    } catch {
      // Mutation hooks surface the API error toast.
    }
  }

  const handleEditListing = (listing: AccountListingItem) => {
    router.push(`/post-ad?edit=${encodeURIComponent(listing.id)}`)
  }

  const counts = data?.counts ?? {
    all: 0,
    active: 0,
    pending: 0,
    rejected: 0,
    sold: 0,
    draft: 0,
    expired: 0,
  }
  const statusOptions = [
    { value: "all", label: t("statusAll"), count: counts.all },
    { value: "active", label: t("statusActive"), count: counts.active },
    { value: "pending", label: t("statusPending"), count: counts.pending },
    { value: "rejected", label: t("statusRejected"), count: counts.rejected },
    { value: "sold", label: t("statusSold"), count: counts.sold },
    { value: "draft", label: t("statusDraft"), count: counts.draft },
    { value: "expired", label: t("statusExpired"), count: counts.expired },
  ] as const
  const statusSelectItems = statusOptions.map((option) => ({
    value: option.value,
    label: `${option.label} (${option.count})`,
  }))

  const categoryFilterIds = useMemo(() => collectCategoryIds(categoryTree, categoryFilter), [categoryTree, categoryFilter])

  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        return statusFilter === "all" || item.status === statusFilter
      })
      .filter((item) => {
        if (!searchQuery.trim()) return true
        const query = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(query) ||
          item.categoryName.toLowerCase().includes(query) ||
          item.location.label.toLowerCase().includes(query)
        )
      })
      .filter((item) => {
        if (categoryFilter === "all") return true
        return categoryFilterIds.has(item.categoryId)
      })
      .sort((a, b) => {
        if (sortOption === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        if (sortOption === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }
        if (sortOption === "most_viewed") {
          return b.viewsCount - a.viewsCount
        }
        if (sortOption === "price_high_low") {
          return b.price - a.price
        }
        if (sortOption === "price_low_high") {
          return a.price - b.price
        }
        return 0
      })
  }, [listings, statusFilter, searchQuery, categoryFilter, categoryFilterIds, sortOption])

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title={tGenerated("myListings")}
        action={
          <Button
            render={
              <Link href="/post-ad">
                <Plus size={16} weight="bold" />
                <span><LocalizedText id="postNewAd" /></span>
              </Link>
            }
            className="h-10 px-4 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs sm:text-sm rounded-xl shadow-xs"
          />
        }
      />

      <div className="space-y-4">
        <AccountListingsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
        />

        <div className="flex">
          <Select
            value={statusFilter}
            items={statusSelectItems}
            onValueChange={(value) => setStatusFilter(value as AccountListingFilterStatus)}
          >
            <SelectTrigger className="h-10 w-full bg-background sm:w-56">
              <SelectValue placeholder={tGenerated("listingStatus")} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span>{option.label}</span>
                  <span className="text-muted-foreground">{option.count}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-border/80 p-10 text-center text-sm text-muted-foreground bg-card">
            <LocalizedText id="loadingYourListings" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/30 p-10 text-center text-sm text-destructive bg-card">
            <LocalizedText id="weCouldnTLoadYourListingsPleaseRefreshAnd" />
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="space-y-3 pt-2">
            {filteredListings.map((listing) => (
              <AccountListingCard
                key={listing.id}
                listing={listing}
                onStatusChange={handleStatusChange}
                onPromote={(l) => setPromoteListing(l)}
                onDelete={(l) => setDeleteListing(l)}
                onEdit={handleEditListing}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 p-6 sm:p-10 bg-card/40">
            {statusFilter === "draft" ? (
              <EmptyState
                icon={<BookmarkSimple size={32} className="text-muted-foreground" />}
                title={tGenerated("noSavedDrafts")}
                description={tGenerated("draftListingsEmptyDescription")}
                action={{ label: t("createListing"), href: "/post-ad" }}
              />
            ) : statusFilter === "sold" ? (
              <EmptyState
                icon={<ShoppingBagOpen size={32} className="text-muted-foreground" />}
                title={tGenerated("noSoldListings")}
                description={tGenerated("soldListingsEmptyDescription")}
              />
            ) : statusFilter === "active" ? (
              <EmptyState
                icon={<ListBullets size={32} className="text-muted-foreground" />}
                title={tGenerated("noActiveListings")}
                description={tGenerated("postFirstListingDescription")}
                action={{ label: t("postNewAd"), href: "/post-ad" }}
              />
            ) : searchQuery || categoryFilter !== "all" ? (
              <EmptyState
                icon={<MagnifyingGlass size={32} className="text-muted-foreground" />}
                title={tGenerated("noListingsMatchYourSearch")}
                description={tGenerated("adjustKeywordsOrCategories")}
                action={{
                  label: t("clearFilters"),
                  onClick: () => {
                    setSearchQuery("")
                    setCategoryFilter("all")
                  },
                }}
              />
            ) : (
              <EmptyState
                icon={<ListBullets size={32} className="text-muted-foreground" />}
                title={tGenerated("noListingsFound")}
                description={tGenerated("noMarketplaceListingsYet")}
                action={{ label: t("postAd"), href: "/post-ad" }}
              />
            )}
          </div>
        )}
      </div>

      <PromoteListingDialog
        listing={promoteListing}
        open={Boolean(promoteListing)}
        onOpenChange={(open) => !open && setPromoteListing(null)}
      />

      <DeleteListingDialog
        listing={deleteListing}
        open={Boolean(deleteListing)}
        onOpenChange={(open) => !open && setDeleteListing(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
