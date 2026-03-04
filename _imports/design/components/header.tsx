"use client"

import Link from "next/link"
import { Code2 } from "lucide-react"

const navLinks = [
  { label: "Нүүр хуудас", href: "/" },
  { label: "Лидерүүд", href: "/leaders" },
  { label: "Бүртгэл", href: "/register" },
  { label: "Холбоо барих", href: "/contact" },
]

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-5">
        <nav className="flex items-center gap-10 rounded-full border border-foreground/10 bg-background/30 px-8 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <Code2 className="h-4 w-4 text-background" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              {"CodeX"}
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
