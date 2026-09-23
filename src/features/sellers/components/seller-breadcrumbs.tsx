import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface SellerBreadcrumbsProps {
  sellerName: string
}

export function SellerBreadcrumbs({ sellerName }: SellerBreadcrumbsProps) {
  return (
    <Breadcrumb className="hidden sm:block py-2.5 text-xs sm:text-sm">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/">Home</Link>} />
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/search">Marketplace</Link>} />
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-50 sm:max-w-xs truncate font-medium">
            {sellerName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
