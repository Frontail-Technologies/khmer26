import type { ListingCard } from "@/types"
import { DEMO_LISTINGS } from "@/features/listings/data/demo-listings"
import type { SellerProfileDetail, SellerReview } from "../types"

export const DEMO_SELLERS: Record<string, SellerProfileDetail> = {
  "cambodia-auto-center": {
    id: "seller-1",
    slug: "cambodia-auto-center",
    name: "Cambodia Auto Center",
    username: "cambodia_auto",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=85",
    coverImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=85",
    verified: true,
    sellerType: "Verified Dealer",
    joinedAt: "March 2022",
    location: "Chamkarmon, Phnom Penh",
    responseTime: "within 15 min",
    responseRate: "98%",
    rating: 4.9,
    reviewCount: 86,
    activeListings: 38,
    followers: 342,
    following: 12,
    phone: "+855 12 889 977",
    website: "https://cambodiaautocenter.com",
    languages: ["Khmer", "English", "Chinese"],
    badges: ["Top Rated 2026", "Fast Responder", "Identity Verified"],
    bio: "Official certified pre-owned automobile dealership in Phnom Penh. Specializing in Toyota, Lexus, Honda, and Mazda hybrid & fuel-efficient vehicles. Complete 120-point mechanical inspection, tax paper verification, and 6-month warranty on every vehicle deal.",
  },

  "elite-real-estate": {
    id: "seller-2",
    slug: "elite-real-estate",
    name: "Elite Real Estate Cambodia",
    username: "eliterealestate",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=85",
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85",
    verified: true,
    sellerType: "Verified Business",
    joinedAt: "January 2021",
    location: "Chroy Changvar, Phnom Penh",
    responseTime: "within 30 min",
    responseRate: "99%",
    rating: 5.0,
    reviewCount: 112,
    activeListings: 45,
    followers: 520,
    following: 25,
    phone: "+855 77 334 455",
    website: "https://eliterealestate.kh",
    languages: ["Khmer", "English", "French"],
    badges: ["Super Seller", "Hard Title Specialist", "Bank Loan Partner"],
    bio: "Premier residential and commercial property consultancy in Cambodia. Specializing in luxury villas, modern condos, and high-growth land investments across Phnom Penh and Siem Reap. We provide full legal due diligence, title transfer support, and bank loan approvals.",
  },

  "sokha-tech-store": {
    id: "seller-3",
    slug: "sokha-tech-store",
    name: "Sokha Tech Store",
    username: "sokhatech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=85",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&q=85",
    verified: true,
    sellerType: "Verified Business",
    joinedAt: "August 2023",
    location: "Daun Penh, Phnom Penh",
    responseTime: "within 5 min",
    responseRate: "100%",
    rating: 4.8,
    reviewCount: 64,
    activeListings: 19,
    followers: 215,
    following: 8,
    phone: "+855 96 555 1234",
    languages: ["Khmer", "English"],
    badges: ["Apple Specialist", "Same-Day Delivery", "Authentic Guarantee"],
    bio: "Direct importer of authentic Apple iPhones, iPads, MacBooks, and premium smartphone accessories. 100% genuine guaranteed with store warranty and express delivery across Cambodia.",
  },

  "david-pc-gaming": {
    id: "seller-4",
    slug: "david-pc-gaming",
    name: "David PC & Tech",
    username: "davidpctech",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=85",
    coverImage: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1400&q=85",
    verified: true,
    sellerType: "Verified Business",
    joinedAt: "October 2022",
    location: "Toul Kork, Phnom Penh",
    responseTime: "within 1 hour",
    responseRate: "96%",
    rating: 4.7,
    reviewCount: 42,
    activeListings: 14,
    followers: 180,
    following: 15,
    phone: "+855 88 776 6554",
    languages: ["Khmer", "English"],
    badges: ["Custom PC Builder", "Hardware Warranty"],
    bio: "Your trusted shop for custom gaming PCs, ultrabooks, mechanical keyboards, and computer accessories in Toul Kork. Free setup and software optimization with every laptop purchase.",
  },
}

export const DEMO_SELLER_REVIEWS: Record<string, SellerReview[]> = {
  "cambodia-auto-center": [
    {
      id: "rev-1",
      authorName: "Rithy S.",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      rating: 5,
      date: "2 weeks ago",
      comment: "Bought a 2018 Prius from this dealer. The car is in exceptional condition, exactly as described. Clean battery test report and smooth registration transfer.",
      verifiedPurchase: true,
      listingTitle: "Toyota Prius 2018 — Hybrid",
    },
    {
      id: "rev-2",
      authorName: "Channary Mom",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      rating: 5,
      date: "1 month ago",
      comment: "Very professional team. They helped me inspect the car thoroughly and answered all my questions about maintenance.",
      verifiedPurchase: true,
      listingTitle: "Honda CR-V 2020",
    },
    {
      id: "rev-3",
      authorName: "Vannak Keo",
      authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
      rating: 4,
      date: "2 months ago",
      comment: "Good communication and fair price negotiation. Highly recommended seller in Chamkarmon.",
      verifiedPurchase: true,
      listingTitle: "Mazda CX-5 2019",
    },
  ],

  "elite-real-estate": [
    {
      id: "rev-4",
      authorName: "Sovann Som",
      authorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80",
      rating: 5,
      date: "3 weeks ago",
      comment: "Outstanding service for villa purchase in Chroy Changvar. The hard title verification and legal paper transfer were completed without any friction.",
      verifiedPurchase: true,
      listingTitle: "Modern Villa for Sale — 4 Bedrooms",
    },
    {
      id: "rev-5",
      authorName: "Bopha Pich",
      authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
      rating: 5,
      date: "1 month ago",
      comment: "Extremely knowledgeable about Phnom Penh real estate trends. Helped us secure our dream family condo.",
      verifiedPurchase: true,
      listingTitle: "2-Bedroom Condo BKK1",
    },
  ],

  "sokha-tech-store": [
    {
      id: "rev-6",
      authorName: "Dara Heng",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
      rating: 5,
      date: "4 days ago",
      comment: "iPhone 15 Pro was brand new in box with 100% battery health. Super fast delivery in Daun Penh within 30 minutes!",
      verifiedPurchase: true,
      listingTitle: "iPhone 15 Pro 256GB",
    },
    {
      id: "rev-7",
      authorName: "Sreypov Lim",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
      rating: 5,
      date: "2 weeks ago",
      comment: "Honest seller. The phone came with screen protector and case as promised. Will buy again.",
      verifiedPurchase: true,
      listingTitle: "iPad Pro 11\" M2",
    },
  ],

  "david-pc-gaming": [
    {
      id: "rev-8",
      authorName: "Piseth Mean",
      authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
      rating: 5,
      date: "1 week ago",
      comment: "Dell XPS 13 works flawlessly. Keyboard and display are in pristine condition. Great shop in Toul Kork.",
      verifiedPurchase: true,
      listingTitle: "Dell XPS 13 Laptop — Core i7",
    },
  ],
}

export function getSellerBySlug(slug: string): SellerProfileDetail | null {
  if (DEMO_SELLERS[slug]) {
    return DEMO_SELLERS[slug]
  }

  const cleanSlug = slug.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase()
  if (DEMO_SELLERS[cleanSlug]) {
    return DEMO_SELLERS[cleanSlug]
  }

  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    id: `seller-${slug}`,
    slug,
    name: title,
    username: slug.replace(/-/g, "_"),
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=85",
    coverImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=85",
    verified: true,
    sellerType: "Verified Business",
    joinedAt: "March 2023",
    location: "Phnom Penh, Cambodia",
    responseTime: "within 30 min",
    responseRate: "95%",
    rating: 4.8,
    reviewCount: 18,
    activeListings: 8,
    followers: 120,
    following: 5,
    phone: "+855 12 345 678",
    languages: ["Khmer", "English"],
    bio: `${title} is an active seller on Khmer26 offering verified goods with fast customer response.`,
  }
}

export function getSellerListings(sellerSlug: string): ListingCard[] {
  if (sellerSlug === "cambodia-auto-center") {
    return DEMO_LISTINGS.filter((l) => l.categoryPath.includes("vehicles") || l.categoryPath.includes("cars") || l.categoryPath.includes("motorcycles"))
  }
  if (sellerSlug === "elite-real-estate") {
    return DEMO_LISTINGS.filter((l) => l.categoryPath.includes("property") || l.categoryPath.includes("houses") || l.categoryPath.includes("land") || l.categoryPath.includes("apartments"))
  }
  if (sellerSlug === "sokha-tech-store" || sellerSlug === "david-pc-gaming") {
    return DEMO_LISTINGS.filter((l) => l.categoryPath.includes("electronics") || l.categoryPath.includes("phones") || l.categoryPath.includes("laptops") || l.categoryPath.includes("tablets") || l.categoryPath.includes("cameras") || l.categoryPath.includes("audio"))
  }
  return DEMO_LISTINGS.slice(0, 8)
}

export function getSellerReviews(sellerSlug: string): SellerReview[] {
  return DEMO_SELLER_REVIEWS[sellerSlug] || [
    {
      id: "rev-default-1",
      authorName: "Kosal V.",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      rating: 5,
      date: "2 weeks ago",
      comment: "Very fast response and smooth transaction. Item received in great condition.",
      verifiedPurchase: true,
    },
    {
      id: "rev-default-2",
      authorName: "Sreyleak N.",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      rating: 5,
      date: "1 month ago",
      comment: "Reliable seller on Khmer26. Highly recommended!",
      verifiedPurchase: true,
    },
  ]
}
