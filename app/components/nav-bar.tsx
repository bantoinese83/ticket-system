"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NotificationCenter } from "./notification-center"

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Tickets", href: "/tickets" },
  { name: "Users", href: "/users" },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">A11y Tickets</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-secondary-foreground hover:bg-secondary-foreground/10",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <NotificationCenter />
          </div>
        </div>
      </div>
    </nav>
  )
}

