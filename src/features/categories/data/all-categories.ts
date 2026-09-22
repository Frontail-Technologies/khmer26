export interface CategoryLeaf {
  id: string
  name: string
  slug: string
  listingCount: number
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  listingCount: number
  children?: CategoryLeaf[]
}

export interface DetailedCategory {
  id: string
  name: string
  slug: string
  imageUrl: string
  iconName: string
  description: string
  listingCount: number
  featuredTags: string[]
  subcategories: Subcategory[]
}

export const ALL_DETAILED_CATEGORIES: DetailedCategory[] = [
  {
    id: "vehicles",
    name: "Vehicles & Automotive",
    slug: "vehicles",
    imageUrl: "/images/categories/cars.jpg",
    iconName: "Car",
    description: "Cars, motorcycles, trucks, automotive spare parts, and accessories across Cambodia",
    listingCount: 4821,
    featuredTags: ["Toyota Prius", "Lexus RX", "Honda Scoopy", "Ford Ranger", "Yamaha Click"],
    subcategories: [
      {
        id: "cars",
        name: "Cars & SUVs",
        slug: "cars",
        listingCount: 2340,
        children: [
          { id: "suv", name: "SUV / 4WD", slug: "suv", listingCount: 612 },
          { id: "sedan", name: "Sedan", slug: "sedan", listingCount: 498 },
          { id: "pickup", name: "Pickup Truck", slug: "pickup", listingCount: 301 },
          { id: "hatchback", name: "Hatchback", slug: "hatchback", listingCount: 187 },
          { id: "van", name: "Van & Minivan", slug: "van", listingCount: 142 },
        ],
      },
      {
        id: "motorcycles",
        name: "Motorcycles & Scooters",
        slug: "motorcycles",
        listingCount: 1890,
        children: [
          { id: "scooters", name: "Automatic Scooters", slug: "scooters", listingCount: 820 },
          { id: "manual-bikes", name: "Manual & Sport", slug: "manual-bikes", listingCount: 430 },
          { id: "electric-bikes", name: "Electric Bikes", slug: "electric-bikes", listingCount: 240 },
        ],
      },
      {
        id: "commercial-vehicles",
        name: "Commercial & Trucks",
        slug: "trucks",
        listingCount: 391,
      },
      {
        id: "parts-accessories",
        name: "Spare Parts & Tires",
        slug: "parts",
        listingCount: 200,
      },
    ],
  },
  {
    id: "properties",
    name: "Property & Real Estate",
    slug: "property",
    imageUrl: "/images/categories/properties.jpg",
    iconName: "Buildings",
    description: "Houses, borey villas, condos, land parcels, and commercial spaces for sale or rent",
    listingCount: 3210,
    featuredTags: ["Phnom Penh Condo", "Borey Villa", "Land for Sale", "Apartment for Rent", "Shophouse"],
    subcategories: [
      {
        id: "houses-villas",
        name: "Houses & Villas",
        slug: "houses",
        listingCount: 890,
        children: [
          { id: "twin-villa", name: "Twin Villa", slug: "twin-villa", listingCount: 280 },
          { id: "link-house", name: "Link House", slug: "link-house", listingCount: 310 },
          { id: "shophouse", name: "Shophouse / E0", slug: "shophouse", listingCount: 300 },
        ],
      },
      {
        id: "apartments-condos",
        name: "Apartments & Condos",
        slug: "apartments",
        listingCount: 1204,
        children: [
          { id: "studio", name: "Studio", slug: "studio", listingCount: 340 },
          { id: "1-bed", name: "1 Bedroom", slug: "1-bedroom", listingCount: 520 },
          { id: "2-bed", name: "2+ Bedrooms", slug: "2-bedrooms", listingCount: 344 },
        ],
      },
      {
        id: "land-parcels",
        name: "Land for Sale",
        slug: "land",
        listingCount: 654,
      },
      {
        id: "commercial-rent",
        name: "Commercial Property",
        slug: "commercial",
        listingCount: 462,
      },
    ],
  },
  {
    id: "mobiles",
    name: "Phones & Tablets",
    slug: "phones",
    imageUrl: "/images/categories/mobiles.jpg",
    iconName: "DeviceMobile",
    description: "Smartphones, tablets, smartwatches, phone accessories, and genuine second-hand gadgets",
    listingCount: 3450,
    featuredTags: ["iPhone 15 Pro", "Samsung S24 Ultra", "iPad Pro", "Apple Watch", "Xiaomi"],
    subcategories: [
      {
        id: "smartphones",
        name: "Smartphones",
        slug: "smartphones",
        listingCount: 2100,
        children: [
          { id: "apple", name: "Apple iPhone", slug: "apple", listingCount: 1200 },
          { id: "samsung", name: "Samsung Galaxy", slug: "samsung", listingCount: 580 },
          { id: "google-xiaomi", name: "Xiaomi & Pixel", slug: "xiaomi-pixel", listingCount: 320 },
        ],
      },
      {
        id: "tablets",
        name: "Tablets & iPads",
        slug: "tablets",
        listingCount: 680,
      },
      {
        id: "smartwatches",
        name: "Smartwatches & Wearables",
        slug: "wearables",
        listingCount: 370,
      },
      {
        id: "accessories",
        name: "Chargers, Cases & Audio",
        slug: "phone-accessories",
        listingCount: 300,
      },
    ],
  },
  {
    id: "electronics",
    name: "Computers & Electronics",
    slug: "electronics",
    imageUrl: "/images/categories/appliances.jpg",
    iconName: "Laptop",
    description: "Laptops, desktop PCs, computer parts, monitors, gaming consoles, and cameras",
    listingCount: 2840,
    featuredTags: ["MacBook Pro", "Gaming PC", "Sony Alpha", "PlayStation 5", "RTX 4080"],
    subcategories: [
      {
        id: "laptops",
        name: "Laptops & MacBooks",
        slug: "laptops",
        listingCount: 1340,
        children: [
          { id: "apple-macbook", name: "MacBook", slug: "macbook", listingCount: 620 },
          { id: "gaming-laptops", name: "Gaming Laptops", slug: "gaming-laptops", listingCount: 420 },
          { id: "ultrabooks", name: "Business Ultrabooks", slug: "ultrabooks", listingCount: 300 },
        ],
      },
      {
        id: "desktop-components",
        name: "Desktops & Components",
        slug: "desktop-pc",
        listingCount: 520,
      },
      {
        id: "cameras-optics",
        name: "Cameras & Lenses",
        slug: "cameras",
        listingCount: 420,
      },
      {
        id: "gaming-consoles",
        name: "Gaming & VR",
        slug: "gaming",
        listingCount: 560,
      },
    ],
  },
  {
    id: "furniture",
    name: "Furniture & Home Living",
    slug: "furniture",
    imageUrl: "/images/categories/furniture.jpg",
    iconName: "Armchair",
    description: "Living room sets, bedroom furniture, office desks, dining tables, kitchenware, and decor",
    listingCount: 2140,
    featuredTags: ["Solid Wood Sofa", "Office Ergonomic Chair", "King Size Bed", "Dining Table", "Wardrobe"],
    subcategories: [
      {
        id: "living-room",
        name: "Living Room & Sofas",
        slug: "living-room",
        listingCount: 780,
      },
      {
        id: "bedroom",
        name: "Beds & Mattresses",
        slug: "bedroom",
        listingCount: 560,
      },
      {
        id: "office-furniture",
        name: "Office Desks & Chairs",
        slug: "office",
        listingCount: 440,
      },
      {
        id: "home-decor",
        name: "Home Decor & Lighting",
        slug: "home-decor",
        listingCount: 360,
      },
    ],
  },
  {
    id: "fashion",
    name: "Fashion, Shoes & Watches",
    slug: "fashion",
    imageUrl: "/images/categories/fashion.jpg",
    iconName: "TShirt",
    description: "Men and women clothing, luxury watches, handbags, sneakers, and jewelry",
    listingCount: 3870,
    featuredTags: ["Rolex Watch", "Nike Sneakers", "Designer Bag", "Traditional Khmer Silk", "Jewelry"],
    subcategories: [
      {
        id: "men-fashion",
        name: "Men's Clothing & Shoes",
        slug: "men-fashion",
        listingCount: 1420,
      },
      {
        id: "women-fashion",
        name: "Women's Fashion & Bags",
        slug: "women-fashion",
        listingCount: 1650,
      },
      {
        id: "watches-jewelry",
        name: "Luxury Watches & Jewelry",
        slug: "watches",
        listingCount: 800,
      },
    ],
  },
  {
    id: "bikes",
    name: "Bicycles & Electric Rides",
    slug: "motorcycles",
    imageUrl: "/images/categories/bikes.jpg",
    iconName: "Bicycle",
    description: "Mountain bikes, road racing bicycles, folding bikes, electric scooters, and cycling gear",
    listingCount: 920,
    featuredTags: ["Trek Mountain Bike", "Giant Road Bike", "Electric Scooter", "Folding Bike"],
    subcategories: [
      {
        id: "mountain-bikes",
        name: "Mountain Bikes (MTB)",
        slug: "mountain-bikes",
        listingCount: 420,
      },
      {
        id: "road-bikes",
        name: "Road & Gravel Bikes",
        slug: "road-bikes",
        listingCount: 280,
      },
      {
        id: "cycling-gear",
        name: "Helmets & Accessories",
        slug: "cycling-accessories",
        listingCount: 220,
      },
    ],
  },
  {
    id: "commercial",
    name: "Commercial & Machinery",
    slug: "vehicles",
    imageUrl: "/images/categories/commercial.jpg",
    iconName: "Truck",
    description: "Industrial equipment, agricultural machines, generators, heavy excavators, and commercial tools",
    listingCount: 740,
    featuredTags: ["Kubota Tractor", "Caterpillar Excavator", "Diesel Generator", "Solar Inverter"],
    subcategories: [
      {
        id: "heavy-machinery",
        name: "Heavy Equipment",
        slug: "machinery",
        listingCount: 380,
      },
      {
        id: "generators-power",
        name: "Generators & Power",
        slug: "generators",
        listingCount: 210,
      },
      {
        id: "farm-tools",
        name: "Agriculture Equipment",
        slug: "farm-equipment",
        listingCount: 150,
      },
    ],
  },
  {
    id: "jobs",
    name: "Jobs & Careers",
    slug: "jobs",
    imageUrl: "/images/categories/jobs.jpg",
    iconName: "Briefcase",
    description: "Full-time vacancies, part-time jobs, management roles, tech positions, and freelance gigs",
    listingCount: 1820,
    featuredTags: ["Sales Executive", "Software Engineer", "Accountant", "English Teacher", "Driver"],
    subcategories: [
      {
        id: "full-time-jobs",
        name: "Full-Time Positions",
        slug: "full-time",
        listingCount: 890,
      },
      {
        id: "part-time-jobs",
        name: "Part-Time & Internships",
        slug: "part-time",
        listingCount: 430,
      },
      {
        id: "remote-freelance",
        name: "Remote & Freelance",
        slug: "freelance",
        listingCount: 500,
      },
    ],
  },
  {
    id: "services",
    name: "Services & Skilled Trade",
    slug: "services",
    imageUrl: "/images/categories/services.jpg",
    iconName: "Wrench",
    description: "Home repair, plumbing, aircon cleaning, translation, web development, photography, and tutoring",
    listingCount: 2100,
    featuredTags: ["Aircon Repair", "House Moving", "Legal & Visa", "Web Design", "Plumber"],
    subcategories: [
      {
        id: "home-maintenance",
        name: "Home Maintenance & AC",
        slug: "home-garden",
        listingCount: 621,
      },
      {
        id: "auto-services",
        name: "Automotive Repair & Detailing",
        slug: "auto-services",
        listingCount: 480,
      },
      {
        id: "it-creative",
        name: "IT, Design & Photography",
        slug: "tech-it",
        listingCount: 390,
      },
      {
        id: "health-beauty",
        name: "Health, Spa & Personal",
        slug: "beauty-wellness",
        listingCount: 609,
      },
    ],
  },
  {
    id: "pets",
    name: "Pets & Animals",
    slug: "animals",
    imageUrl: "/images/categories/pets.jpg",
    iconName: "Dog",
    description: "Puppies, kittens, birds, aquarium fish, pet cages, food, and grooming supplies",
    listingCount: 640,
    featuredTags: ["Poodle Puppy", "Persian Cat", "Aquarium Fish", "Pet Food & Cage"],
    subcategories: [
      {
        id: "dogs-puppies",
        name: "Dogs & Puppies",
        slug: "dogs",
        listingCount: 310,
      },
      {
        id: "cats-kittens",
        name: "Cats & Kittens",
        slug: "cats",
        listingCount: 190,
      },
      {
        id: "pet-supplies",
        name: "Pet Food & Accessories",
        slug: "pet-accessories",
        listingCount: 140,
      },
    ],
  },
  {
    id: "hobbies",
    name: "Books, Sports & Leisure",
    slug: "sports",
    imageUrl: "/images/categories/hobbies.jpg",
    iconName: "Football",
    description: "Gym equipment, musical instruments, soccer gear, camping tents, books, and collectibles",
    listingCount: 980,
    featuredTags: ["Electric Guitar", "Treadmill", "Camping Tent", "Badminton Racket", "Books"],
    subcategories: [
      {
        id: "fitness-gym",
        name: "Fitness & Gym Equipment",
        slug: "fitness",
        listingCount: 360,
      },
      {
        id: "music-instruments",
        name: "Musical Instruments",
        slug: "musical-instruments",
        listingCount: 320,
      },
      {
        id: "outdoor-camping",
        name: "Camping & Outdoor",
        slug: "outdoor",
        listingCount: 300,
      },
    ],
  },
]
