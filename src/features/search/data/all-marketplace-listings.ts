import type { ListingCard } from "@/types"
import { DEMO_SEARCH_LISTINGS } from "./demo-results-listings"
import { DEMO_LISTINGS } from "@/features/listings/data/demo-listings"

const ADDITIONAL_CATEGORY_LISTINGS: ListingCard[] = [
  {
    id: "job-1",
    slug: "senior-software-engineer-phnom-penh-13914021",
    title: "Senior Software Engineer (React / Node.js / Next.js)",
    price: 1800,
    currency: "USD",
    negotiable: true,
    condition: "new",
    status: "active",
    categoryPath: ["jobs", "full-time"],
    primaryImage: {
      id: "img-j1",
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
      alt: "Senior Software Engineer",
      isPrimary: true,
    },
    location: { province: "Phnom Penh", district: "BKK 1", label: "BKK 1, Phnom Penh" },
    createdAt: "2026-09-24T08:00:00Z",
  },
  {
    id: "job-2",
    slug: "sales-marketing-executive-fluent-english-13914022",
    title: "Sales & Marketing Executive — Fluent English & Khmer",
    price: 650,
    currency: "USD",
    negotiable: true,
    condition: "new",
    status: "active",
    categoryPath: ["jobs", "full-time"],
    primaryImage: {
      id: "img-j2",
      url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
      alt: "Sales Executive",
      isPrimary: true,
    },
    location: { province: "Phnom Penh", district: "Daun Penh", label: "Phnom Penh" },
    createdAt: "2026-09-23T11:30:00Z",
  },
  {
    id: "service-1",
    slug: "professional-aircon-cleaning-and-gas-refill-13914023",
    title: "Professional Aircon Cleaning, Repair & Gas Refill Services",
    price: 15,
    currency: "USD",
    negotiable: false,
    condition: "new",
    status: "active",
    categoryPath: ["services", "home-garden", "home-maintenance"],
    primaryImage: {
      id: "img-s1",
      url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80",
      alt: "Aircon Services",
      isPrimary: true,
    },
    location: { province: "Phnom Penh", district: "Tuol Kouk", label: "Phnom Penh All Areas" },
    createdAt: "2026-09-24T09:15:00Z",
  },
  {
    id: "fashion-1",
    slug: "rolex-submariner-date-black-dial-ceramic-13914024",
    title: "Rolex Submariner Date 41mm Black Dial (Box & Papers)",
    price: 14200,
    currency: "USD",
    negotiable: true,
    condition: "like_new",
    status: "active",
    categoryPath: ["fashion", "watches", "watches-jewelry"],
    brand: "Rolex",
    primaryImage: {
      id: "img-f1",
      url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
      alt: "Rolex Submariner",
      isPrimary: true,
    },
    location: { province: "Phnom Penh", district: "BKK 1", label: "BKK 1, Phnom Penh" },
    createdAt: "2026-09-24T14:20:00Z",
  },
  {
    id: "fashion-2",
    slug: "nike-air-jordan-1-retro-high-og-chicago-13914025",
    title: "Nike Air Jordan 1 Retro High OG 'Lost & Found' Size 42",
    price: 240,
    currency: "USD",
    negotiable: true,
    condition: "new",
    status: "active",
    categoryPath: ["fashion", "men-fashion"],
    brand: "Nike",
    primaryImage: {
      id: "img-f2",
      url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80",
      alt: "Nike Air Jordan 1",
      isPrimary: true,
    },
    location: { province: "Phnom Penh", district: "Sen Sok", label: "Phnom Penh" },
    createdAt: "2026-09-23T16:00:00Z",
  },
  {
    id: "pet-1",
    slug: "purebred-golden-retriever-puppy-vaccinated-13914026",
    title: "Purebred Golden Retriever Puppy 2 Months Old (Vaccinated)",
    price: 350,
    currency: "USD",
    negotiable: true,
    condition: "new",
    status: "active",
    categoryPath: ["animals", "dogs", "dogs-puppies"],
    primaryImage: {
      id: "img-p1",
      url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80",
      alt: "Golden Retriever Puppy",
      isPrimary: true,
    },
    location: { province: "Phnom Penh", district: "Meanchey", label: "Phnom Penh" },
    createdAt: "2026-09-24T10:00:00Z",
  },
  {
    id: "sport-1",
    slug: "trek-marlin-7-mountain-bike-shimano-deore-13914027",
    title: "Trek Marlin 7 Gen 2 Mountain Bike (Shimano Deore 1x10)",
    price: 520,
    currency: "USD",
    negotiable: true,
    condition: "like_new",
    status: "active",
    categoryPath: ["sports", "fitness", "mountain-bikes"],
    brand: "Trek",
    primaryImage: {
      id: "img-sp1",
      url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80",
      alt: "Trek Marlin 7",
      isPrimary: true,
    },
    location: { province: "Siem Reap", label: "Siem Reap City" },
    createdAt: "2026-09-23T15:40:00Z",
  },
]

const seenIds = new Set<string>()
export const ALL_MARKETPLACE_LISTINGS: ListingCard[] = []

for (const item of [...DEMO_SEARCH_LISTINGS, ...DEMO_LISTINGS, ...ADDITIONAL_CATEGORY_LISTINGS]) {
  if (!seenIds.has(item.id)) {
    seenIds.add(item.id)
    ALL_MARKETPLACE_LISTINGS.push(item)
  }
}
