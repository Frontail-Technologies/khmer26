import { getMediaUrl } from "@/lib/media/get-media-url"
import type { CategoryNode } from "../api/categories.api"
import { getCategoryHref } from "../lib/category-tree"
import { CategoryTile } from "./category-tile"

interface VisualCategoryGridProps {
  categories: CategoryNode[]
}

export function VisualCategoryGrid({ categories }: VisualCategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
      {categories.map((cat) => (
        <CategoryTile
          key={cat.id}
          name={cat.nameEn}
          href={getCategoryHref([cat])}
          imageUrl={getMediaUrl(cat.imageR2Key)}
        />
      ))}
    </div>
  )
}
