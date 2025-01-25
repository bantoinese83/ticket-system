"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

export function Breadcrumbs() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter((segment) => segment !== "")

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-secondary-foreground hover:text-primary">
            Home
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`
          const isLast = index === pathSegments.length - 1

          return (
            <li key={segment} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              {isLast ? (
                <span className="ml-2 text-primary font-medium">{segment}</span>
              ) : (
                <Link href={href} className="ml-2 text-secondary-foreground hover:text-primary">
                  {segment}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

