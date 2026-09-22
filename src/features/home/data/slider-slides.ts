export interface SliderSlide {
  id: string
  badge: string
  title: string
  highlight: string
  description: string
  ctaLabel: string
  ctaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  imageUrl: string
  imageAlt: string
  statLabel: string
  statValue: string
}

export const SLIDER_SLIDES: SliderSlide[] = [
  {
    id: "vehicles",
    badge: "Vehicles & Motors",
    title: "Find your next",
    highlight: "ride nearby",
    description: "Browse verified cars, motorcycles, and commercial vehicles from trusted sellers across Cambodia.",
    ctaLabel: "Browse Vehicles",
    ctaHref: "/category/vehicles",
    secondaryCtaLabel: "Cars for Sale",
    secondaryCtaHref: "/category/cars",
    imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
    imageAlt: "Vehicles on Khmer26",
    statLabel: "Active Listings",
    statValue: "4,800+",
  },
  {
    id: "property",
    badge: "Real Estate & Land",
    title: "Explore homes and",
    highlight: "land plots",
    description: "Discover modern apartments, commercial properties, and residential land in prime locations.",
    ctaLabel: "View Property",
    ctaHref: "/category/property",
    secondaryCtaLabel: "Apartments",
    secondaryCtaHref: "/category/apartments",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    imageAlt: "Properties on Khmer26",
    statLabel: "Properties Listed",
    statValue: "3,200+",
  },
  {
    id: "electronics",
    badge: "Tech & Gadgets",
    title: "Upgrade your tech",
    highlight: "for less",
    description: "Find deals on smartphones, laptops, cameras, and audio gear from verified community members.",
    ctaLabel: "Browse Electronics",
    ctaHref: "/category/electronics",
    secondaryCtaLabel: "Phones",
    secondaryCtaHref: "/category/phones",
    imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",
    imageAlt: "Electronics on Khmer26",
    statLabel: "Tech Products",
    statValue: "5,600+",
  },
  {
    id: "furniture",
    badge: "Home & Living",
    title: "Elevate your",
    highlight: "living space",
    description: "Quality sofas, dining sets, appliances, and home décor at accessible local prices.",
    ctaLabel: "Shop Furniture",
    ctaHref: "/category/furniture",
    secondaryCtaLabel: "All Categories",
    secondaryCtaHref: "/categories",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    imageAlt: "Home & Living on Khmer26",
    statLabel: "Home Items",
    statValue: "2,100+",
  },
  {
    id: "sell",
    badge: "Fast & Free Selling",
    title: "Turn unused items",
    highlight: "into cash",
    description: "Post your ad in less than two minutes and connect directly with thousands of buyers near you.",
    ctaLabel: "Post an Ad Now",
    ctaHref: "/post-ad",
    secondaryCtaLabel: "Pricing Plans",
    secondaryCtaHref: "/pricing",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0a67e55722c0?w=800&q=80",
    imageAlt: "Sell on Khmer26",
    statLabel: "Monthly Buyers",
    statValue: "100K+",
  },
]
