export interface VisualCategory {
  id: string
  name: string
  slug: string
  imageUrl: string
  imageAlt: string
}

export const POPULAR_CATEGORIES: VisualCategory[] = [
  {
    id: "cars",
    name: "Cars",
    slug: "cars",
    imageUrl: "/images/categories/cars.jpg",
    imageAlt: "Cars",
  },
  {
    id: "bikes",
    name: "Bikes",
    slug: "motorcycles",
    imageUrl: "/images/categories/bikes.jpg",
    imageAlt: "Bikes",
  },
  {
    id: "properties",
    name: "Properties",
    slug: "property",
    imageUrl: "/images/categories/properties.jpg",
    imageAlt: "Properties",
  },
  {
    id: "electronics",
    name: "Electronics & Appliances",
    slug: "electronics",
    imageUrl: "/images/categories/appliances.jpg",
    imageAlt: "Electronics & Appliances",
  },
  {
    id: "mobiles",
    name: "Mobiles",
    slug: "phones",
    imageUrl: "/images/categories/mobiles.jpg",
    imageAlt: "Mobiles",
  },
  {
    id: "commercial",
    name: "Commercial Vehicles & Spares",
    slug: "vehicles",
    imageUrl: "/images/categories/commercial.jpg",
    imageAlt: "Commercial Vehicles & Spares",
  },
  {
    id: "jobs",
    name: "Jobs",
    slug: "jobs",
    imageUrl: "/images/categories/jobs.jpg",
    imageAlt: "Jobs",
  },
  {
    id: "furniture",
    name: "Furniture",
    slug: "furniture",
    imageUrl: "/images/categories/furniture.jpg",
    imageAlt: "Furniture",
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    imageUrl: "/images/categories/fashion.jpg",
    imageAlt: "Fashion",
  },
  {
    id: "pets",
    name: "Pets",
    slug: "animals",
    imageUrl: "/images/categories/pets.jpg",
    imageAlt: "Pets",
  },
  {
    id: "hobbies",
    name: "Books, Sports & Hobbies",
    slug: "sports",
    imageUrl: "/images/categories/hobbies.jpg",
    imageAlt: "Books, Sports & Hobbies",
  },
  {
    id: "services",
    name: "Services",
    slug: "services",
    imageUrl: "/images/categories/services.jpg",
    imageAlt: "Services",
  },
]
