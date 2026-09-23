import type { AdminCategoryItem } from "../types"

export const ADMIN_CATEGORY_FILTER_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "cars", label: "Vehicles & Cars" },
  { value: "properties", label: "Real Estate & Property" },
  { value: "mobiles", label: "Mobiles & Tablets" },
  { value: "appliances", label: "Electronics & Computers" },
  { value: "furniture", label: "Home & Furniture" },
  { value: "jobs", label: "Jobs & Services" },
]

export const DEMO_ADMIN_CATEGORIES: AdminCategoryItem[] = [
  {
    id: "vehicles",
    name: "Vehicles & Automotive",
    slug: "vehicles",
    imageUrl: "/images/categories/cars.jpg",
    description: "Cars, motorcycles, trucks, automotive spare parts, and accessories across Cambodia",
    listingCount: 4821,
    isActive: true,
    sortOrder: 1,
    subcategories: [
      { id: "cars", name: "Cars & SUVs", slug: "cars", imageUrl: "/images/categories/cars.jpg", listingCount: 2340, isActive: true, sortOrder: 1 },
      { id: "motorcycles", name: "Motorcycles & Scooters", slug: "motorcycles", imageUrl: "/images/categories/bikes.jpg", listingCount: 1890, isActive: true, sortOrder: 2 },
      { id: "trucks", name: "Commercial Trucks & Vans", slug: "trucks", imageUrl: "/images/categories/commercial.jpg", listingCount: 340, isActive: true, sortOrder: 3 },
      { id: "parts", name: "Auto Parts & Accessories", slug: "parts", imageUrl: "/images/categories/services.jpg", listingCount: 251, isActive: true, sortOrder: 4 },
    ],
  },
  {
    id: "real-estate",
    name: "Real Estate & Properties",
    slug: "real-estate",
    imageUrl: "/images/categories/properties.jpg",
    description: "Villas, condos, commercial land, borey houses, and rental properties in Phnom Penh, Siem Reap & Sihanoukville",
    listingCount: 3420,
    isActive: true,
    sortOrder: 2,
    subcategories: [
      { id: "villas", name: "Villas & Borey Houses", slug: "villas", imageUrl: "/images/categories/properties.jpg", listingCount: 1420, isActive: true, sortOrder: 1 },
      { id: "condos", name: "Condominiums & Apartments", slug: "condos", imageUrl: "/images/categories/properties.jpg", listingCount: 980, isActive: true, sortOrder: 2 },
      { id: "land", name: "Land for Sale & Lease", slug: "land", imageUrl: "/images/categories/properties.jpg", listingCount: 650, isActive: true, sortOrder: 3 },
      { id: "commercial", name: "Commercial & Shophouses", slug: "commercial", imageUrl: "/images/categories/commercial.jpg", listingCount: 370, isActive: true, sortOrder: 4 },
    ],
  },
  {
    id: "phones-tablets",
    name: "Phones & Tablets",
    slug: "phones-tablets",
    imageUrl: "/images/categories/mobiles.jpg",
    description: "Smartphones, Apple iPhones, iPads, Samsung Galaxy, smartwatches, and chargers",
    listingCount: 5210,
    isActive: true,
    sortOrder: 3,
    subcategories: [
      { id: "smartphones", name: "Smartphones", slug: "smartphones", imageUrl: "/images/categories/mobiles.jpg", listingCount: 3400, isActive: true, sortOrder: 1 },
      { id: "tablets", name: "Tablets & iPads", slug: "tablets", imageUrl: "/images/categories/mobiles.jpg", listingCount: 1100, isActive: true, sortOrder: 2 },
      { id: "wearables", name: "Smartwatches & Wearables", slug: "wearables", imageUrl: "/images/categories/mobiles.jpg", listingCount: 450, isActive: true, sortOrder: 3 },
      { id: "accessories", name: "Mobile Accessories", slug: "accessories", imageUrl: "/images/categories/services.jpg", listingCount: 260, isActive: true, sortOrder: 4 },
    ],
  },
  {
    id: "electronics",
    name: "Electronics & Computers",
    slug: "electronics",
    imageUrl: "/images/categories/appliances.jpg",
    description: "Gaming laptops, computer hardware, audio systems, TVs, and home appliances",
    listingCount: 2190,
    isActive: true,
    sortOrder: 4,
    subcategories: [
      { id: "laptops", name: "Laptops & MacBooks", slug: "laptops", imageUrl: "/images/categories/appliances.jpg", listingCount: 950, isActive: true, sortOrder: 1 },
      { id: "desktops", name: "Desktop PCs & Components", slug: "desktops", imageUrl: "/images/categories/appliances.jpg", listingCount: 680, isActive: true, sortOrder: 2 },
      { id: "audio", name: "Headphones & Audio", slug: "audio", imageUrl: "/images/categories/appliances.jpg", listingCount: 320, isActive: true, sortOrder: 3 },
      { id: "appliances", name: "Home Appliances", slug: "appliances", imageUrl: "/images/categories/appliances.jpg", listingCount: 240, isActive: true, sortOrder: 4 },
    ],
  },
  {
    id: "home-furniture",
    name: "Home & Furniture",
    slug: "home-furniture",
    imageUrl: "/images/categories/furniture.jpg",
    description: "Living room sofas, beds, wardrobes, dining sets, kitchen equipment, and decor",
    listingCount: 1840,
    isActive: true,
    sortOrder: 5,
    subcategories: [
      { id: "living-room", name: "Living Room & Sofas", slug: "living-room", imageUrl: "/images/categories/furniture.jpg", listingCount: 680, isActive: true, sortOrder: 1 },
      { id: "bedroom", name: "Bedroom & Mattresses", slug: "bedroom", imageUrl: "/images/categories/furniture.jpg", listingCount: 540, isActive: true, sortOrder: 2 },
      { id: "office", name: "Office Furniture", slug: "office", imageUrl: "/images/categories/furniture.jpg", listingCount: 390, isActive: true, sortOrder: 3 },
      { id: "kitchen", name: "Kitchen & Dining", slug: "kitchen", imageUrl: "/images/categories/furniture.jpg", listingCount: 230, isActive: true, sortOrder: 4 },
    ],
  },
  {
    id: "fashion",
    name: "Fashion & Beauty",
    slug: "fashion",
    imageUrl: "/images/categories/fashion.jpg",
    description: "Men and women clothing, watches, luxury bags, shoes, jewelry, and cosmetics",
    listingCount: 3120,
    isActive: true,
    sortOrder: 6,
    subcategories: [
      { id: "men-clothing", name: "Men's Clothing & Shoes", slug: "men-clothing", imageUrl: "/images/categories/fashion.jpg", listingCount: 1200, isActive: true, sortOrder: 1 },
      { id: "women-clothing", name: "Women's Clothing & Bags", slug: "women-clothing", imageUrl: "/images/categories/fashion.jpg", listingCount: 1450, isActive: true, sortOrder: 2 },
      { id: "watches", name: "Watches & Jewelry", slug: "watches", imageUrl: "/images/categories/fashion.jpg", listingCount: 470, isActive: true, sortOrder: 3 },
    ],
  },
  {
    id: "jobs-services",
    name: "Jobs & Services",
    slug: "jobs-services",
    imageUrl: "/images/categories/jobs.jpg",
    description: "Employment opportunities, freelance work, business services, and repair technicians",
    listingCount: 960,
    isActive: true,
    sortOrder: 7,
    subcategories: [
      { id: "jobs", name: "Job Openings", slug: "jobs", imageUrl: "/images/categories/jobs.jpg", listingCount: 580, isActive: true, sortOrder: 1 },
      { id: "services", name: "Professional Services", slug: "services", imageUrl: "/images/categories/services.jpg", listingCount: 380, isActive: true, sortOrder: 2 },
    ],
  },
  {
    id: "pets",
    name: "Pets & Animals",
    slug: "pets",
    imageUrl: "/images/categories/pets.jpg",
    description: "Dogs, cats, birds, pet food, supplies, and veterinary accessories",
    listingCount: 640,
    isActive: true,
    sortOrder: 8,
    subcategories: [
      { id: "dogs", name: "Dogs & Puppies", slug: "dogs", imageUrl: "/images/categories/pets.jpg", listingCount: 310, isActive: true, sortOrder: 1 },
      { id: "cats", name: "Cats & Kittens", slug: "cats", imageUrl: "/images/categories/pets.jpg", listingCount: 220, isActive: true, sortOrder: 2 },
      { id: "pet-supplies", name: "Pet Food & Accessories", slug: "pet-supplies", imageUrl: "/images/categories/pets.jpg", listingCount: 110, isActive: true, sortOrder: 3 },
    ],
  },
]

export function getCategoryById(idOrSlug: string): AdminCategoryItem | null {
  return (
    DEMO_ADMIN_CATEGORIES.find(
      (c) => c.id === idOrSlug || c.slug === idOrSlug
    ) ?? null
  )
}

export function getSubcategoryById(idOrSlug: string): {
  subcategory: AdminCategoryItem["subcategories"][number]
  parent: AdminCategoryItem
} | null {
  for (const cat of DEMO_ADMIN_CATEGORIES) {
    const sub = cat.subcategories.find(
      (s) => s.id === idOrSlug || s.slug === idOrSlug
    )
    if (sub) {
      return { subcategory: sub, parent: cat }
    }
  }
  return null
}
