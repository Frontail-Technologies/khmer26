export interface LocationCity {
  id: string
  name: string
  slug: string
  listingCount: number
  imageUrl: string
}

export const DEMO_LOCATIONS: LocationCity[] = [
  {
    id: "phnom-penh",
    name: "Phnom Penh",
    slug: "phnom-penh",
    listingCount: 12540,
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80",
  },
  {
    id: "siem-reap",
    name: "Siem Reap",
    slug: "siem-reap",
    listingCount: 4320,
    imageUrl: "https://images.unsplash.com/photo-1608481337062-4093bf3ed404?w=600&q=80",
  },
  {
    id: "sihanoukville",
    name: "Sihanoukville",
    slug: "sihanoukville",
    listingCount: 3120,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  },
  {
    id: "battambang",
    name: "Battambang",
    slug: "battambang",
    listingCount: 1860,
    imageUrl: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80",
  },
  {
    id: "kampot",
    name: "Kampot",
    slug: "kampot",
    listingCount: 1240,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
  },
  {
    id: "kandal",
    name: "Kandal",
    slug: "kandal",
    listingCount: 980,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
  },
]

