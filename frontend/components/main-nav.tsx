"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ClipboardList } from "lucide-react"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className="flex items-center space-x-2 text-xl font-bold"
      >
        <ClipboardList className="h-6 w-6" />
        <span>TeamTasker</span>
      </Link>
    </nav>
  )
}