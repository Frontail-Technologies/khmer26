import type { CategoryFieldDef } from "../types"

export const CATEGORY_FIELD_CONFIGS: Record<string, CategoryFieldDef[]> = {
  cars: [
    {
      key: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: ["Toyota", "Lexus", "Ford", "Honda", "Mazda", "Hyundai", "Kia", "Mercedes-Benz", "BMW", "Audi", "Nissan", "Mitsubishi", "MG", "BYD", "Tesla", "Other"],
    },
    {
      key: "model",
      label: "Model",
      type: "text",
      required: true,
      placeholder: "e.g. Prius, Camry, Ranger, Land Cruiser",
    },
    {
      key: "year",
      label: "Year",
      type: "select",
      required: true,
      options: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "Older"],
    },
    {
      key: "mileage",
      label: "Mileage",
      type: "number",
      required: true,
      placeholder: "e.g. 45000",
      unit: "km",
    },
    {
      key: "fuel",
      label: "Fuel Type",
      type: "select",
      required: true,
      options: ["Hybrid", "Gasoline", "Diesel", "Electric", "Plug-in Hybrid"],
    },
    {
      key: "transmission",
      label: "Transmission",
      type: "select",
      required: true,
      options: ["Automatic", "Manual", "e-CVT"],
    },
    {
      key: "bodyType",
      label: "Body Type",
      type: "select",
      options: ["SUV / 4WD", "Sedan", "Pickup Truck", "Hatchback", "Van / Minivan", "Coupe", "Convertible"],
    },
    {
      key: "color",
      label: "Exterior Color",
      type: "text",
      placeholder: "e.g. White, Black, Grey, Silver",
    },
  ],

  motorcycles: [
    {
      key: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: ["Honda", "Yamaha", "Suzuki", "Kawasaki", "BMW", "KTM", "Ducati", "Vespa", "Royal Enfield", "Other"],
    },
    {
      key: "model",
      label: "Model",
      type: "text",
      required: true,
      placeholder: "e.g. ADV 160, Scoopy, Dream, Click, Aerox",
    },
    {
      key: "year",
      label: "Year",
      type: "select",
      options: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "Older"],
    },
    {
      key: "engine",
      label: "Engine Capacity",
      type: "text",
      placeholder: "e.g. 125cc, 150cc, 300cc, 500cc",
      unit: "cc",
    },
    {
      key: "mileage",
      label: "Mileage",
      type: "number",
      placeholder: "e.g. 12000",
      unit: "km",
    },
  ],

  houses: [
    {
      key: "propertyType",
      label: "Property Type",
      type: "select",
      required: true,
      options: ["Single Villa", "Twin Villa", "Link Villa", "Shophouse", "Townhouse", "Flat (E0, E1)", "Other"],
    },
    {
      key: "bedrooms",
      label: "Bedrooms",
      type: "select",
      required: true,
      options: ["1", "2", "3", "4", "5", "6+"],
    },
    {
      key: "bathrooms",
      label: "Bathrooms",
      type: "select",
      required: true,
      options: ["1", "2", "3", "4", "5", "6+"],
    },
    {
      key: "landSize",
      label: "Land Size",
      type: "text",
      placeholder: "e.g. 12m × 20m (240 m²)",
    },
    {
      key: "houseSize",
      label: "House Size",
      type: "text",
      placeholder: "e.g. 8m × 15m (3 floors)",
    },
    {
      key: "titleType",
      label: "Title Deed Type",
      type: "select",
      required: true,
      options: ["Hard Title (L-Map)", "Soft Title", "Borey Title Transfer", "Strata Title"],
    },
    {
      key: "furnishing",
      label: "Furnishing",
      type: "select",
      options: ["Fully Furnished", "Semi-Furnished", "Unfurnished"],
    },
    {
      key: "facing",
      label: "Facing Direction",
      type: "select",
      options: ["South", "North", "East", "West", "South-East", "North-East"],
    },
  ],

  apartments: [
    {
      key: "propertyType",
      label: "Property Type",
      type: "select",
      required: true,
      options: ["Condominium", "Serviced Apartment", "Studio", "Penthouse", "Duplex"],
    },
    {
      key: "bedrooms",
      label: "Bedrooms",
      type: "select",
      required: true,
      options: ["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"],
    },
    {
      key: "bathrooms",
      label: "Bathrooms",
      type: "select",
      required: true,
      options: ["1", "2", "3", "4+"],
    },
    {
      key: "floorSize",
      label: "Floor Area",
      type: "text",
      placeholder: "e.g. 65 m²",
    },
    {
      key: "floorNumber",
      label: "Floor Level",
      type: "text",
      placeholder: "e.g. 18th Floor",
    },
    {
      key: "furnishing",
      label: "Furnishing",
      type: "select",
      options: ["Fully Furnished", "Semi-Furnished", "Unfurnished"],
    },
  ],

  land: [
    {
      key: "landType",
      label: "Land Category",
      type: "select",
      required: true,
      options: ["Residential Land", "Commercial Land", "Agricultural Land", "Industrial Land", "Development Plot"],
    },
    {
      key: "dimensions",
      label: "Dimensions / Area",
      type: "text",
      required: true,
      placeholder: "e.g. 20m × 50m (1,000 m²)",
    },
    {
      key: "titleType",
      label: "Title Deed Type",
      type: "select",
      required: true,
      options: ["Hard Title (L-Map)", "Soft Title", "Company Title"],
    },
    {
      key: "roadAccess",
      label: "Road Access Width",
      type: "text",
      placeholder: "e.g. 12m Concrete Road",
    },
  ],

  smartphones: [
    {
      key: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: ["Apple", "Samsung", "Google", "Xiaomi", "OPPO", "Vivo", "Realme", "Huawei", "OnePlus", "Honor", "Sony", "Other"],
    },
    {
      key: "model",
      label: "Model",
      type: "text",
      required: true,
      placeholder: "e.g. iPhone 15 Pro, Galaxy S24 Ultra",
    },
    {
      key: "storage",
      label: "Storage Capacity",
      type: "select",
      required: true,
      options: ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"],
    },
    {
      key: "ram",
      label: "RAM Memory",
      type: "select",
      options: ["4 GB", "6 GB", "8 GB", "12 GB", "16 GB", "Other"],
    },
    {
      key: "color",
      label: "Color",
      type: "text",
      placeholder: "e.g. Natural Titanium, Phantom Black",
    },
    {
      key: "batteryHealth",
      label: "Battery Health",
      type: "text",
      placeholder: "e.g. 98% Maximum Capacity",
    },
  ],

  laptops: [
    {
      key: "brand",
      label: "Brand",
      type: "select",
      required: true,
      options: ["Apple", "Dell", "Lenovo", "ASUS", "HP", "Acer", "MSI", "Razer", "Microsoft Surface", "Samsung", "Other"],
    },
    {
      key: "model",
      label: "Model",
      type: "text",
      required: true,
      placeholder: "e.g. MacBook Pro 14 M3, XPS 13 9310, ThinkPad X1",
    },
    {
      key: "processor",
      label: "Processor (CPU)",
      type: "text",
      placeholder: "e.g. Intel Core i7-13700H, Apple M3 Pro, Ryzen 7",
    },
    {
      key: "ram",
      label: "RAM Memory",
      type: "select",
      required: true,
      options: ["8 GB", "16 GB", "24 GB", "32 GB", "64 GB"],
    },
    {
      key: "storage",
      label: "Storage (SSD/HDD)",
      type: "select",
      required: true,
      options: ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD", "Other"],
    },
    {
      key: "display",
      label: "Screen Size",
      type: "select",
      options: ["13.3\" - 13.6\"", "14.0\" - 14.2\"", "15.6\"", "16.0\" - 16.2\"", "17.3\""],
    },
  ],

  jobs: [
    {
      key: "jobTitle",
      label: "Job Position Title",
      type: "text",
      required: true,
      placeholder: "e.g. Senior Frontend Engineer, Sales Executive",
    },
    {
      key: "employmentType",
      label: "Employment Type",
      type: "select",
      required: true,
      options: ["Full-time", "Part-time", "Contract", "Internship", "Remote / Freelance"],
    },
    {
      key: "salaryRange",
      label: "Salary Range",
      type: "text",
      placeholder: "e.g. $800 - $1,500 / month, Negotiable",
    },
    {
      key: "experience",
      label: "Experience Level",
      type: "select",
      options: ["No Experience / Fresh Graduate", "1 - 2 Years", "3 - 5 Years", "5+ Years"],
    },
  ],

  furniture: [
    {
      key: "furnitureType",
      label: "Item Type",
      type: "select",
      required: true,
      options: ["Sofa / Couch", "Dining Table & Chairs", "Bed & Mattress", "Wardrobe / Closet", "Office Desk & Chair", "TV Cabinet", "Bookshelf", "Other"],
    },
    {
      key: "material",
      label: "Material",
      type: "text",
      placeholder: "e.g. Solid Teak Wood, Leather, Velvet, Metal",
    },
    {
      key: "color",
      label: "Color",
      type: "text",
      placeholder: "e.g. Grey, Natural Wood, Walnut",
    },
  ],
}

export function getCategoryFields(categorySlug: string): CategoryFieldDef[] {
  const clean = categorySlug.toLowerCase()

  if (CATEGORY_FIELD_CONFIGS[clean]) {
    return CATEGORY_FIELD_CONFIGS[clean]
  }

  if (clean.includes("car") || clean.includes("suv") || clean.includes("sedan") || clean.includes("pickup") || clean.includes("vehicle")) {
    return CATEGORY_FIELD_CONFIGS.cars || []
  }
  if (clean.includes("motorcycle") || clean.includes("bike")) {
    return CATEGORY_FIELD_CONFIGS.motorcycles || []
  }
  if (clean.includes("house") || clean.includes("villa") || clean.includes("property")) {
    return CATEGORY_FIELD_CONFIGS.houses || []
  }
  if (clean.includes("condo") || clean.includes("apartment")) {
    return CATEGORY_FIELD_CONFIGS.apartments || []
  }
  if (clean.includes("land") || clean.includes("plot")) {
    return CATEGORY_FIELD_CONFIGS.land || []
  }
  if (clean.includes("phone") || clean.includes("smartphone") || clean.includes("apple") || clean.includes("samsung")) {
    return CATEGORY_FIELD_CONFIGS.smartphones || []
  }
  if (clean.includes("laptop") || clean.includes("computer") || clean.includes("pc")) {
    return CATEGORY_FIELD_CONFIGS.laptops || []
  }
  if (clean.includes("job") || clean.includes("career")) {
    return CATEGORY_FIELD_CONFIGS.jobs || []
  }
  if (clean.includes("furniture") || clean.includes("table") || clean.includes("sofa")) {
    return CATEGORY_FIELD_CONFIGS.furniture || []
  }

  return [
    {
      key: "brand",
      label: "Brand / Manufacturer",
      type: "text",
      placeholder: "e.g. Brand name",
    },
    {
      key: "color",
      label: "Color",
      type: "text",
      placeholder: "e.g. Black, White",
    },
    {
      key: "origin",
      label: "Country of Origin",
      type: "text",
      placeholder: "e.g. Cambodia, Japan, USA",
    },
  ]
}
