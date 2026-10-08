import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { CategoryCrumb } from "../../api/listing-detail.api"

interface ListingBreadcrumbsProps {
  /** Real category ancestry, root first. Any depth. */
  categoryPath: CategoryCrumb[]
  title: string
}

export function ListingBreadcrumbs({ categoryPath, title }: ListingBreadcrumbsProps) {
  return (
    <Breadcrumb className="hidden sm:block py-2 text-xs sm:text-sm">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/">Home</Link>} />
        </BreadcrumbItem>

        {categoryPath.map((crumb, index) => {
          const href = `/category/${categoryPath
            .slice(0, index + 1)
            .map((c) => encodeURIComponent(c.slug))
            .join("/")}`
          return (
            <span key={crumb.id} className="inline-flex items-center gap-1.5 sm:gap-2.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={href}>{crumb.nameEn}</Link>} />
              </BreadcrumbItem>
            </span>
          )
        })}

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-50 sm:max-w-xs truncate font-medium">
            {title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
