"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, ListBullets, MagnifyingGlass, BookmarkSimple, ShoppingBagOpen } from "@phosphor-icons/react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { AccountPageHeader } from "../../components/account-page-header"
import { AccountListingCard } from "./account-listing-card"
import { AccountListingsToolbar, type ListingSortOption } from "./account-listings-toolbar"
import { PromoteListingDialog } from "./promote-listing-dialog"
import { DeleteListingDialog } from "./delete-listing-dialog"
import { DEMO_ACCOUNT_LISTINGS } from "../../data/demo-account-data"
import type { AccountListingItem, AccountListingFilterStatus, AccountListingStatus } from "../../types"

const DRAFT_STORAGE_KEY = "khmer26_post_ad_draft"

function getInitialListings(): AccountListingItem[] {
  if (typeof window === "undefined") return DEMO_ACCOUNT_LISTINGS

  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (stored) {
      const parsedDraft = JSON.parse(stored)
      const draftItem: AccountListingItem = {
        id: "local-draft-1",
        slug: "saved-local-draft",
        title: parsedDraft.title || "Untitled Draft Listing",
        price: parsedDraft.price ? Number(parsedDraft.price) : 0,
        currency: parsedDraft.currency || "USD",
        negotiable: Boolean(parsedDraft.negotiable),
        condition: parsedDraft.condition || "like_new",
        status: "draft",
        imageUrl: parsedDraft.photos?.[0]?.previewUrl || "",
        location: parsedDraft.location || {
          province: "Phnom Penh",
          label: "Phnom Penh",
        },
        categoryName: parsedDraft.categoryPath?.join(" / ") || "Uncategorized",
        categoryId: parsedDraft.categoryId || "general",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 0,
        favoritesCount: 0,
        messagesCount: 0,
      }

      return [draftItem, ...DEMO_ACCOUNT_LISTINGS]
    }
  } catch {
  }

  return DEMO_ACCOUNT_LISTINGS
}

export function AccountListingsView() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AccountListingFilterStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortOption, setSortOption] = useState<ListingSortOption>("newest")
  const [listings, setListings] = useState<AccountListingItem[]>(getInitialListings)

  const [promoteListing, setPromoteListing] = useState<AccountListingItem | null>(null)
  const [deleteListing, setDeleteListing] = useState<AccountListingItem | null>(null)

  const handleStatusChange = (id: string, newStatus: AccountListingStatus) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    )
  }

  const handleDeleteConfirm = (id: string) => {
    if (id === "local-draft-1") {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      } catch {
      }
    }
    setListings((prev) => prev.filter((item) => item.id !== id))
  }

  const handleContinueEditingDraft = () => {
    router.push("/post-ad")
  }

  const counts = useMemo(() => {
    return {
      all: listings.length,
      active: listings.filter((l) => l.status === "active").length,
      pending: listings.filter((l) => l.status === "pending").length,
      sold: listings.filter((l) => l.status === "sold").length,
      draft: listings.filter((l) => l.status === "draft").length,
      expired: listings.filter((l) => l.status === "expired" || l.status === "paused").length,
    }
  }, [listings])

  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        if (activeTab === "all") return true
        if (activeTab === "expired") {
          return item.status === "expired" || item.status === "paused"
        }
        return item.status === activeTab
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
        return item.categoryId.toLowerCase().includes(categoryFilter.toLowerCase())
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
  }, [listings, activeTab, searchQuery, categoryFilter, sortOption])

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title="My Listings"
        description="Manage your marketplace listings."
        action={
          <Button
            render={
              <Link href="/post-ad">
                <Plus size={16} weight="bold" />
                <span>Post New Ad</span>
              </Link>
            }
            className="h-10 px-4 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-xs sm:text-sm rounded-xl shadow-xs"
          />
        }
      />

      <div className="space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as AccountListingFilterStatus)}
          className="w-full"
        >
          <div className="overflow-x-auto no-scrollbar pb-1">
            <TabsList className="h-10 p-1 bg-muted/80 rounded-xl gap-1 w-full sm:w-auto min-w-max flex justify-start">
              <TabsTrigger value="all" className="px-3 py-1.5 text-xs font-bold gap-1.5 rounded-lg">
                <span>All</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-background/80 text-foreground/80 font-semibold">
                  {counts.all}
                </span>
              </TabsTrigger>
              <TabsTrigger value="active" className="px-3 py-1.5 text-xs font-bold gap-1.5 rounded-lg">
                <span>Active</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-background/80 text-foreground/80 font-semibold">
                  {counts.active}
                </span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="px-3 py-1.5 text-xs font-bold gap-1.5 rounded-lg">
                <span>Pending</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-background/80 text-foreground/80 font-semibold">
                  {counts.pending}
                </span>
              </TabsTrigger>
              <TabsTrigger value="sold" className="px-3 py-1.5 text-xs font-bold gap-1.5 rounded-lg">
                <span>Sold</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-background/80 text-foreground/80 font-semibold">
                  {counts.sold}
                </span>
              </TabsTrigger>
              <TabsTrigger value="draft" className="px-3 py-1.5 text-xs font-bold gap-1.5 rounded-lg">
                <span>Draft</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-background/80 text-foreground/80 font-semibold">
                  {counts.draft}
                </span>
              </TabsTrigger>
              <TabsTrigger value="expired" className="px-3 py-1.5 text-xs font-bold gap-1.5 rounded-lg">
                <span>Expired</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-background/80 text-foreground/80 font-semibold">
                  {counts.expired}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        <AccountListingsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
        />

        {filteredListings.length > 0 ? (
          <div className="space-y-3 pt-2">
            {filteredListings.map((listing) => (
              <AccountListingCard
                key={listing.id}
                listing={listing}
                onStatusChange={handleStatusChange}
                onPromote={(l) => setPromoteListing(l)}
                onDelete={(l) => setDeleteListing(l)}
                onContinueEditingDraft={handleContinueEditingDraft}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 p-6 sm:p-10 bg-card/40">
            {activeTab === "draft" ? (
              <EmptyState
                icon={<BookmarkSimple size={32} className="text-muted-foreground" />}
                title="No saved drafts"
                description="Your saved drafts will appear here so you can finish posting anytime."
                action={{ label: "Create a Listing", href: "/post-ad" }}
              />
            ) : activeTab === "sold" ? (
              <EmptyState
                icon={<ShoppingBagOpen size={32} className="text-muted-foreground" />}
                title="No sold listings"
                description="Listings marked as sold will appear here for your sales record."
              />
            ) : activeTab === "active" ? (
              <EmptyState
                icon={<ListBullets size={32} className="text-muted-foreground" />}
                title="No active listings"
                description="Post your first listing to start selling to buyers across Cambodia."
                action={{ label: "Post New Ad", href: "/post-ad" }}
              />
            ) : searchQuery || categoryFilter !== "all" ? (
              <EmptyState
                icon={<MagnifyingGlass size={32} className="text-muted-foreground" />}
                title="No listings match your search"
                description="Try adjusting your keywords or category filters."
                action={{
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchQuery("")
                    setCategoryFilter("all")
                  },
                }}
              />
            ) : (
              <EmptyState
                icon={<ListBullets size={32} className="text-muted-foreground" />}
                title="No listings found"
                description="You haven't posted any marketplace listings yet."
                action={{ label: "Post an Ad", href: "/post-ad" }}
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
