import { ALL_DETAILED_CATEGORIES, type DetailedCategory, type Subcategory, type CategoryLeaf } from "../data/all-categories"

export interface ResolvedCategoryTaxonomy {
  rootCategory: DetailedCategory
  currentSubcategory?: Subcategory
  currentLeaf?: CategoryLeaf
  isRoot: boolean
  title: string
  description?: string
  breadcrumbs: { label: string; href?: string }[]
  canonicalPath: string
  siblingSubcategories: {
    name: string
    slug: string
    href: string
    isActive: boolean
    listingCount: number
    imageUrl?: string
  }[]
  filterCategorySlug: string
}

function normalizeSlug(slug: string): string {
  return slug.toLowerCase().trim()
}

const CATEGORY_ALIASES: Record<string, string> = {
  "real-estate": "property",
  "properties": "property",
  "cars": "vehicles/cars",
  "motorcycles": "vehicles/motorcycles",
  "trucks": "vehicles/trucks",
  "commercial-vehicles": "vehicles/trucks",
  "mobiles": "phones",
  "smartphones": "phones/smartphones",
  "tablets": "phones/tablets",
  "appliances": "electronics",
  "computers": "electronics",
  "laptops": "electronics/laptops",
  "pets": "animals",
  "hobbies": "sports",
}

export function resolveCategoryFromSlugs(slugSegments: string[]): ResolvedCategoryTaxonomy | null {
  if (!slugSegments || slugSegments.length === 0) return null

  const rawFirst = normalizeSlug(slugSegments[0])
  let rootSlug = rawFirst
  let subSlug = slugSegments.length > 1 ? normalizeSlug(slugSegments[1]) : undefined
  const leafSlug = slugSegments.length > 2 ? normalizeSlug(slugSegments[2]) : undefined

  if (slugSegments.length === 1 && CATEGORY_ALIASES[rawFirst]) {
    const aliased = CATEGORY_ALIASES[rawFirst]
    if (aliased.includes("/")) {
      const parts = aliased.split("/")
      rootSlug = parts[0]
      subSlug = parts[1]
    } else {
      rootSlug = aliased
    }
  } else if (CATEGORY_ALIASES[rawFirst] && !CATEGORY_ALIASES[rawFirst].includes("/")) {
    rootSlug = CATEGORY_ALIASES[rawFirst]
  }

  const rootCategory = ALL_DETAILED_CATEGORIES.find(
    (c) => normalizeSlug(c.slug) === rootSlug || normalizeSlug(c.id) === rootSlug
  )

  if (!rootCategory) {
    const formattedFallback = slugSegments[0]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())

    return {
      rootCategory: {
        id: rootSlug,
        name: formattedFallback,
        slug: rootSlug,
        imageUrl: "/images/categories/cars.jpg",
        iconName: "Tag",
        description: `Browse verified ${formattedFallback} listings in Cambodia`,
        listingCount: 0,
        featuredTags: [],
        subcategories: [],
      },
      isRoot: slugSegments.length === 1,
      title: formattedFallback,
      description: `Browse verified ${formattedFallback} listings in Cambodia`,
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Categories", href: "/categories" },
        { label: formattedFallback },
      ],
      canonicalPath: `/category/${slugSegments.join("/")}`,
      siblingSubcategories: [],
      filterCategorySlug: slugSegments[slugSegments.length - 1],
    }
  }

  let matchedSubcategory: Subcategory | undefined
  if (subSlug) {
    matchedSubcategory = rootCategory.subcategories.find(
      (s) =>
        normalizeSlug(s.slug) === subSlug ||
        normalizeSlug(s.id) === subSlug ||
        normalizeSlug(s.slug) === normalizeSlug(slugSegments[1]) ||
        normalizeSlug(s.id) === normalizeSlug(slugSegments[1])
    )
  }

  let matchedLeaf: CategoryLeaf | undefined
  if (matchedSubcategory && leafSlug && matchedSubcategory.children) {
    matchedLeaf = matchedSubcategory.children.find(
      (l) => normalizeSlug(l.slug) === leafSlug || normalizeSlug(l.id) === leafSlug
    )
  }

  const isRoot = !matchedSubcategory

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
  ]

  if (isRoot) {
    breadcrumbs.push({ label: rootCategory.name })
  } else {
    breadcrumbs.push({
      label: rootCategory.name,
      href: `/category/${rootCategory.slug}`,
    })

    if (matchedLeaf) {
      breadcrumbs.push({
        label: matchedSubcategory!.name,
        href: `/category/${rootCategory.slug}/${matchedSubcategory!.slug}`,
      })
      breadcrumbs.push({ label: matchedLeaf.name })
    } else {
      breadcrumbs.push({ label: matchedSubcategory!.name })
    }
  }

  const title = matchedLeaf
    ? matchedLeaf.name
    : matchedSubcategory
    ? matchedSubcategory.name
    : rootCategory.name

  const description = isRoot
    ? rootCategory.description
    : `Explore verified ${title} listings in ${rootCategory.name} across Cambodia on Khmer26.`

  const canonicalPath = `/category/${rootCategory.slug}${
    matchedSubcategory ? `/${matchedSubcategory.slug}` : ""
  }${matchedLeaf ? `/${matchedLeaf.slug}` : ""}`

  const siblingSubcategories = rootCategory.subcategories.map((sub) => {
    const isSubActive = matchedSubcategory?.id === sub.id || matchedSubcategory?.slug === sub.slug
    return {
      name: sub.name,
      slug: sub.slug,
      href: `/category/${rootCategory.slug}/${sub.slug}`,
      isActive: Boolean(isSubActive),
      listingCount: sub.listingCount,
      imageUrl: getSubcategoryImageUrl(rootCategory.slug, sub.slug),
    }
  })

  const filterCategorySlug = matchedLeaf
    ? matchedLeaf.slug
    : matchedSubcategory
    ? matchedSubcategory.slug
    : rootCategory.slug

  return {
    rootCategory,
    currentSubcategory: matchedSubcategory,
    currentLeaf: matchedLeaf,
    isRoot,
    title,
    description,
    breadcrumbs,
    canonicalPath,
    siblingSubcategories,
    filterCategorySlug,
  }
}

export function getSubcategoryImageUrl(rootSlug: string, subSlug: string): string {
  const normRoot = normalizeSlug(rootSlug)
  const normSub = normalizeSlug(subSlug)

  if (normRoot === "vehicles") {
    if (normSub === "cars") return "/images/categories/cars.jpg"
    if (normSub === "motorcycles") return "/images/categories/bikes.jpg"
    if (normSub === "trucks" || normSub === "commercial-vehicles") return "/images/categories/commercial.jpg"
    if (normSub === "parts" || normSub === "parts-accessories") return "/images/categories/commercial.jpg"
    return "/images/categories/cars.jpg"
  }

  if (normRoot === "property" || normRoot === "real-estate" || normRoot === "properties") {
    return "/images/categories/properties.jpg"
  }

  if (normRoot === "phones" || normRoot === "mobiles") {
    return "/images/categories/mobiles.jpg"
  }

  if (normRoot === "electronics") {
    return "/images/categories/appliances.jpg"
  }

  if (normRoot === "furniture") {
    return "/images/categories/furniture.jpg"
  }

  if (normRoot === "fashion") {
    return "/images/categories/fashion.jpg"
  }

  if (normRoot === "jobs") {
    return "/images/categories/jobs.jpg"
  }

  if (normRoot === "services") {
    return "/images/categories/services.jpg"
  }

  if (normRoot === "animals" || normRoot === "pets") {
    return "/images/categories/pets.jpg"
  }

  if (normRoot === "sports" || normRoot === "hobbies") {
    return "/images/categories/hobbies.jpg"
  }

  return "/images/categories/cars.jpg"
}
