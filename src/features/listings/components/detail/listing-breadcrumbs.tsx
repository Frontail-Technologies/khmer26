import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface ListingBreadcrumbsProps {
  categoryPath?: string[]
  title: string
}

export function ListingBreadcrumbs({ categoryPath = [], title }: ListingBreadcrumbsProps) {
  return (
    <Breadcrumb className="py-2 text-xs sm:text-sm">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/">Home</Link>} />
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/search">Marketplace</Link>} />
        </BreadcrumbItem>

        {categoryPath.map((segment) => {
          return (
            <span key={segment} className="inline-flex items-center gap-1.5 sm:gap-2.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={
                    <Link
                      href={`/search?category=${encodeURIComponent(segment.toLowerCase())}`}
                    >
                      {segment}
                    </Link>
                  }
                />
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
