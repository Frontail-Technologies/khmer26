import type { ListingCard, ListingDetail, ListingImage, ListingSeller } from "@/types"
import { DEMO_LISTINGS } from "./demo-listings"
import { DEMO_SEARCH_LISTINGS } from "@/features/search/data/demo-results-listings"

const DEFAULT_SELLER: ListingSeller = {
  id: "seller-1",
  slug: "cambodia-auto-center",
  name: "Cambodia Auto Center",
  username: "cambodia_auto",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
  verified: true,
  joinedAt: "March 2022",
  responseTime: "Within 15 minutes",
  responseRate: "98%",
  activeListings: 38,
  phone: "+855 12 889 977",
  rating: 4.9,
}

const INDIVIDUAL_SELLER: ListingSeller = {
  id: "seller-3",
  slug: "sokha-tech-store",
  name: "Sokha Verified Seller",
  username: "sokhastore",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  verified: true,
  joinedAt: "August 2023",
  responseTime: "Within 5 minutes",
  responseRate: "100%",
  activeListings: 19,
  phone: "+855 96 555 1234",
  rating: 4.8,
}

const VEHICLE_GALLERY = [
  "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=85",
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=85",
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=85",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=85",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=85",
]

const PROPERTY_GALLERY = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=85",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85",
]

const GENERAL_GALLERY = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&q=85",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85",
]

const RICH_DETAILS: Record<string, ListingDetail> = {
  "toyota-prius-2018-hybrid-excellent-condition-13914001": {
    id: "1",
    slug: "toyota-prius-2018-hybrid-excellent-condition-13914001",
    title: "Toyota Prius 2018 — Hybrid Excellent Condition",
    price: 25000,
    currency: "USD",
    negotiable: true,
    condition: "like_new",
    status: "active",
    categoryId: "cars",
    categoryPath: ["Vehicles", "Cars", "Toyota"],
    sellerId: "seller-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    viewCount: 542,
    featured: true,
    verified: true,
    location: { province: "Phnom Penh", district: "Chamkarmon", label: "Chamkarmon, Phnom Penh" },
    seller: DEFAULT_SELLER,
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=85",
        alt: "Toyota Prius 2018 Front View",
        isPrimary: true,
      },
      {
        id: "img-1-2",
        url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=85",
        alt: "Toyota Prius 2018 Side Profile",
        isPrimary: false,
      },
      {
        id: "img-1-3",
        url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=85",
        alt: "Toyota Prius Interior Dashboard",
        isPrimary: false,
      },
      {
        id: "img-1-4",
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=85",
        alt: "Toyota Prius Rear View",
        isPrimary: false,
      },
      {
        id: "img-1-5",
        url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=85",
        alt: "Toyota Prius Wheel and Tire",
        isPrimary: false,
      },
    ],
    attributes: [
      { label: "Brand", value: "Toyota" },
      { label: "Model", value: "Prius" },
      { label: "Year", value: "2018" },
      { label: "Condition", value: "Like New (95%)" },
      { label: "Mileage", value: "48,000 km" },
      { label: "Fuel Type", value: "Hybrid (Gasoline + Electric)" },
      { label: "Transmission", value: "Automatic (e-CVT)" },
      { label: "Body Type", value: "Hatchback" },
      { label: "Exterior Color", value: "Pearl White" },
      { label: "Interior Color", value: "Grey Leather" },
      { label: "Tax Status", value: "Tax Paper Included" },
      { label: "Drive Type", value: "Front-Wheel Drive (FWD)" },
    ],
    description: `Very clean and well-maintained Toyota Prius 2018 Hybrid for urgent sale.

Key Highlights:
• Fuel efficiency: approximately 4.2L / 100km
• Battery and ABS system tested with 100% health report
• JBL premium surround audio system with Bluetooth & Apple CarPlay
• Lane departure warning, adaptive cruise control, and pre-collision radar
• Original paint with ceramic coating, no collision history, no flood damage
• Complete maintenance records from authorized Toyota service center in Phnom Penh

Price is negotiable for serious buyers. Feel free to contact via chat or call directly to schedule an inspection and test drive.`,
  },

  "modern-villa-for-sale-chroy-changvar-13914002": {
    id: "2",
    slug: "modern-villa-for-sale-chroy-changvar-13914002",
    title: "Modern Villa for Sale — 4 Bedrooms, Private Garden",
    price: 320000,
    currency: "USD",
    negotiable: true,
    condition: "new",
    status: "active",
    categoryId: "houses",
    categoryPath: ["Property", "Houses & Villas", "For Sale"],
    sellerId: "seller-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    viewCount: 1280,
    featured: true,
    verified: true,
    location: { province: "Phnom Penh", district: "Chroy Changvar", label: "Chroy Changvar, Phnom Penh" },
    seller: {
      id: "seller-2",
      slug: "elite-real-estate",
      name: "Elite Real Estate Cambodia",
      username: "eliterealestate",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
      verified: true,
      joinedAt: "January 2021",
      responseTime: "Within 30 minutes",
      responseRate: "99%",
      activeListings: 45,
      phone: "+855 77 334 455",
      rating: 5.0,
    },
    images: [
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85",
        alt: "Modern Villa Exterior Front",
        isPrimary: true,
      },
      {
        id: "img-2-2",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85",
        alt: "Spacious Living Room",
        isPrimary: false,
      },
      {
        id: "img-2-3",
        url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=85",
        alt: "Modern Open Concept Kitchen",
        isPrimary: false,
      },
      {
        id: "img-2-4",
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=85",
        alt: "Master Bedroom with Balcony",
        isPrimary: false,
      },
      {
        id: "img-2-5",
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85",
        alt: "Private Garden and Terrace",
        isPrimary: false,
      },
    ],
    attributes: [
      { label: "Property Type", value: "Single Villa" },
      { label: "Bedrooms", value: "4 Bedrooms" },
      { label: "Bathrooms", value: "5 Bathrooms" },
      { label: "Land Size", value: "12m × 20m (240 m²)" },
      { label: "House Size", value: "8m × 15m (360 m² total)" },
      { label: "Floors", value: "3 Floors (E0, E1, E2 + Rooftop)" },
      { label: "Title Type", value: "Hard Title (L-Map)" },
      { label: "Furnishing", value: "Fully Furnished" },
      { label: "Facing", value: "South (Fresh River Breeze)" },
      { label: "Parking", value: "2 Cars + 4 Motorbikes" },
    ],
    description: `Brand new contemporary luxury villa located in the high-growth residential area of Chroy Changvar, Phnom Penh.

Property Features:
• 4 large en-suite bedrooms with built-in wardrobes
• Gourmet chef kitchen with Italian marble countertops and premium appliances
• Open-plan double-height ceiling living hall with floor-to-ceiling glass windows
• Private landscaped courtyard garden and rooftop sunset sky lounge
• 24/7 security with CCTV surveillance and gated entrance

Location Advantages:
• 5 minutes to Bayon Market and OCIC Development Zone
• 8 minutes to Japanese Friendship Bridge and Norton University
• Hard title transfer fee covered by owner. Bank loan approval support available up to 70%.`,
  },

  "iphone-15-pro-256gb-natural-titanium-13914003": {
    id: "3",
    slug: "iphone-15-pro-256gb-natural-titanium-13914003",
    title: "iPhone 15 Pro 256GB — Natural Titanium",
    price: 1050,
    currency: "USD",
    negotiable: false,
    condition: "like_new",
    status: "active",
    categoryId: "smartphones",
    categoryPath: ["Electronics", "Phones", "Apple"],
    sellerId: "seller-3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    viewCount: 890,
    featured: true,
    verified: true,
    location: { province: "Phnom Penh", district: "Daun Penh", label: "Daun Penh, Phnom Penh" },
    seller: {
      id: "seller-3",
      slug: "sokha-tech-store",
      name: "Sokha Tech Store",
      username: "sokhatech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      verified: true,
      joinedAt: "August 2023",
      responseTime: "Within 5 minutes",
      responseRate: "100%",
      activeListings: 19,
      phone: "+855 96 555 1234",
      rating: 4.8,
    },
    images: [
      {
        id: "img-3",
        url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&q=85",
        alt: "iPhone 15 Pro Natural Titanium Front and Back",
        isPrimary: true,
      },
      {
        id: "img-3-2",
        url: "https://images.unsplash.com/photo-1695048065057-de4094a946cf?w=1200&q=85",
        alt: "iPhone 15 Pro Titanium Frame Details",
        isPrimary: false,
      },
      {
        id: "img-3-3",
        url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=85",
        alt: "iPhone Screen Display On",
        isPrimary: false,
      },
    ],
    attributes: [
      { label: "Brand", value: "Apple" },
      { label: "Model", value: "iPhone 15 Pro" },
      { label: "Storage", value: "256 GB" },
      { label: "Color", value: "Natural Titanium" },
      { label: "Condition", value: "Like New 99% (No scratches)" },
      { label: "Battery Health", value: "98% Maximum Capacity" },
      { label: "SIM Support", value: "Physical Nano-SIM + eSIM" },
      { label: "Apple Warranty", value: "Official Apple Care until December 2026" },
      { label: "Included Accessories", value: "Original Box, Braided USB-C Cable, Case" },
    ],
    description: `iPhone 15 Pro 256GB in the most desirable Natural Titanium finish. Used with high-grade screen protector and Torras case since day one.

Specs & Details:
• A17 Pro chip with hardware ray tracing
• 48MP main camera system with 3x optical telephoto
• Action button and titanium lightweight chassis
• Battery health at 98% with low charge cycles
• Never dropped, never repaired, all original parts guaranteed

Comes with complete original retail box, braided cable, and 2 premium protective cases. Pick up in Daun Penh or same-day delivery via Grab/Foodpanda across Phnom Penh.`,
  },

  "dell-xps-13-laptop-core-i7-16gb-ram-13914004": {
    id: "4",
    slug: "dell-xps-13-laptop-core-i7-16gb-ram-13914004",
    title: "Dell XPS 13 Laptop — Core i7, 16GB RAM, 512GB SSD",
    price: 450,
    currency: "USD",
    negotiable: true,
    condition: "good",
    status: "active",
    categoryId: "laptops",
    categoryPath: ["Electronics", "Computers", "Laptops"],
    sellerId: "seller-4",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    viewCount: 420,
    featured: false,
    verified: true,
    location: { province: "Phnom Penh", district: "Toul Kork", label: "Toul Kork, Phnom Penh" },
    seller: {
      id: "seller-4",
      slug: "david-pc-gaming",
      name: "David PC & Tech",
      username: "davidpctech",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      verified: true,
      joinedAt: "October 2022",
      responseTime: "Within 1 hour",
      responseRate: "96%",
      activeListings: 14,
      phone: "+855 88 776 6554",
      rating: 4.7,
    },
    images: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&q=85",
        alt: "Dell XPS 13 Laptop Display",
        isPrimary: true,
      },
      {
        id: "img-4-2",
        url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&q=85",
        alt: "Dell XPS 13 Keyboard & Trackpad",
        isPrimary: false,
      },
      {
        id: "img-4-3",
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=85",
        alt: "Dell XPS 13 Slim Profile",
        isPrimary: false,
      },
    ],
    attributes: [
      { label: "Brand", value: "Dell" },
      { label: "Model", value: "XPS 13 (9310)" },
      { label: "Processor", value: "Intel Core i7-1185G7 (Up to 4.8 GHz)" },
      { label: "RAM Memory", value: "16 GB LPDDR4x 4267MHz" },
      { label: "Storage", value: "512 GB PCIe NVMe M.2 SSD" },
      { label: "Display", value: "13.4\" InfinityEdge 4K UHD+ Touch (3840 x 2400)" },
      { label: "Graphics", value: "Intel Iris Xe Graphics" },
      { label: "Battery Life", value: "Excellent (~7 hours video playback)" },
      { label: "Operating System", value: "Windows 11 Pro Genuine" },
      { label: "Weight", value: "1.2 kg Ultra-portable" },
    ],
    description: `Dell XPS 13 ultrabook in very good condition. Perfect for programming, office work, university study, and remote digital nomads.

Highlights:
• Stunning 4K InfinityEdge touchscreen with 500 nits brightness and 100% sRGB
• Fast Core i7 with 16GB RAM handles multitasking with ease
• Carbon fiber palm rest and CNC machined aluminum chassis
• Fingerprint reader and Windows Hello facial recognition
• Comes with original 65W Type-C fast charger

Test all hardware components at Toul Kork shop. 1-month full hardware warranty included.`,
  },
}

function createFallbackCardFromSlug(slug: string): ListingCard {
  const words = slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  const title = words.join(" ") || "Marketplace Listing"
  const isVehicle = /car|toyota|lexus|ford|honda|hyundai|kia|nissan|bmw|mercedes|mazda/i.test(slug)
  const isProperty = /villa|condo|house|apartment|land/i.test(slug)

  let categoryPath = ["General"]
  let imageUrl = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85"

  if (isVehicle) {
    categoryPath = ["Vehicles", "Cars"]
    imageUrl = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=85"
  } else if (isProperty) {
    categoryPath = ["Property", "Real Estate"]
    imageUrl = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85"
  }

  return {
    id: `dynamic-${slug}`,
    slug,
    title,
    price: 15000,
    currency: "USD",
    negotiable: true,
    condition: "like_new",
    status: "active",
    categoryPath,
    location: {
      province: "Phnom Penh",
      district: "Chamkarmon",
      label: "Chamkarmon, Phnom Penh",
    },
    primaryImage: {
      id: `img-${slug}-1`,
      url: imageUrl,
      alt: title,
      isPrimary: true,
    },
    createdAt: new Date().toISOString(),
    verified: true,
    featured: false,
  }
}

function buildListingDetailFromCard(base: ListingCard): ListingDetail {
  const isVehicle =
    base.categoryPath?.some((c) => /vehicle|car|motorcycle|sedan|suv|pickup/i.test(c)) ||
    base.brand ||
    base.year ||
    base.fuel
  const isProperty = base.categoryPath?.some((c) => /property|house|villa|land|condo|apartment/i.test(c))

  const gallerySource = isVehicle ? VEHICLE_GALLERY : isProperty ? PROPERTY_GALLERY : GENERAL_GALLERY

  const images: ListingImage[] = [
    base.primaryImage ?? {
      id: `img-${base.id}-1`,
      url: gallerySource[0],
      alt: base.title,
      isPrimary: true,
    },
    {
      id: `img-${base.id}-2`,
      url: gallerySource[1 % gallerySource.length],
      alt: `${base.title} Interior / Side Angle`,
      isPrimary: false,
    },
    {
      id: `img-${base.id}-3`,
      url: gallerySource[2 % gallerySource.length],
      alt: `${base.title} Detailed Profile`,
      isPrimary: false,
    },
    {
      id: `img-${base.id}-4`,
      url: gallerySource[3 % gallerySource.length],
      alt: `${base.title} Additional View`,
      isPrimary: false,
    },
  ]

  const attributes: Array<{ label: string; value: string }> = []

  if (base.attributes && base.attributes.length > 0) {
    attributes.push(...base.attributes)
  } else {
    if (base.brand) attributes.push({ label: "Brand", value: base.brand })
    if (base.year) attributes.push({ label: "Year", value: String(base.year) })
    if (base.condition) {
      attributes.push({
        label: "Condition",
        value: base.condition.replace(/_/g, " ").toUpperCase(),
      })
    }
    if (base.mileage) {
      attributes.push({
        label: "Mileage",
        value: `${base.mileage.toLocaleString("en-US")} km`,
      })
    }
    if (base.fuel) attributes.push({ label: "Fuel Type", value: base.fuel })
    if (base.transmission) attributes.push({ label: "Transmission", value: base.transmission })
    if (base.sellerType) {
      attributes.push({
        label: "Seller Type",
        value: base.sellerType === "dealer" ? "Verified Dealer" : "Private Seller",
      })
    }
    if (base.categoryPath && base.categoryPath.length > 0) {
      attributes.push({
        label: "Category",
        value: base.categoryPath.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" > "),
      })
    }
    if (base.location?.label) {
      attributes.push({ label: "Location", value: base.location.label })
    }
    attributes.push({ label: "Availability", value: "In Stock / Ready to deal" })
    attributes.push({ label: "Inspection", value: "Available for live inspection" })
  }

  const seller = base.sellerType === "individual" ? INDIVIDUAL_SELLER : DEFAULT_SELLER

  return {
    id: base.id,
    slug: base.slug,
    title: base.title,
    price: base.price,
    currency: base.currency,
    negotiable: base.negotiable,
    condition: base.condition,
    status: base.status,
    categoryId: base.categoryPath?.[0] ?? "general",
    categoryPath: base.categoryPath ?? ["General"],
    sellerId: seller.id,
    createdAt: base.createdAt,
    updatedAt: base.createdAt,
    viewCount: 384,
    featured: base.featured,
    verified: base.verified,
    location: base.location,
    seller,
    images,
    attributes,
    description: `${base.title} available for sale in ${base.location.label}.\n\nCondition: ${base.condition.replace(/_/g, " ").toUpperCase()}.\n\nKey Highlights:\n• Thoroughly inspected and verified\n• Complete ownership documentation available\n• Fast response and hassle-free transaction support\n\nPlease reach out via chat or call directly to schedule an inspection.`,
  }
}

export function getListingBySlug(slug: string): ListingDetail | null {
  if (RICH_DETAILS[slug]) {
    return RICH_DETAILS[slug]
  }

  const base =
    DEMO_LISTINGS.find((item) => item.slug === slug || item.id === slug) ||
    DEMO_SEARCH_LISTINGS.find((item) => item.slug === slug || item.id === slug) ||
    createFallbackCardFromSlug(slug)

  return buildListingDetailFromCard(base)
}

export function getSimilarListings(currentSlug: string, limit: number = 8) {
  const combined = [...DEMO_SEARCH_LISTINGS, ...DEMO_LISTINGS]
  const seenSlugs = new Set<string>()
  const filtered: ListingCard[] = []

  for (const item of combined) {
    if (item.slug === currentSlug) continue
    if (seenSlugs.has(item.slug)) continue
    seenSlugs.add(item.slug)
    filtered.push(item)
    if (filtered.length >= limit) break
  }

  return filtered
}

