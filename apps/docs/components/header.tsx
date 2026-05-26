'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiGithubFill, RiMenu2Line } from '@remixicon/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@timui/react'

import { useIsMobile } from '@/hooks/use-mobile'
import HeaderLink from '@/components/header-link'
import ThemeToggle from '@/components/theme-toggle'

const links: { text: string; href: string; isNew?: boolean }[] = [
  { text: 'Components', href: '/components' },
  { text: 'Blocks', href: '/blocks', isNew: true },
  { text: 'Templates', href: '/templates', isNew: true },
  { text: 'Agents', href: '/agents' },
]

export default function Header() {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 md:px-6">
        <Link className="group flex items-center gap-2.5 text-sm" href="/" aria-label="首页">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all group-hover:scale-105 active:scale-95">
            <span className="text-sm font-bold">T</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-[13px] font-bold tracking-tight text-foreground">
              Timkit UI
            </span>
            <span className="text-[9px] font-medium text-muted-foreground/80 lowercase tracking-wide">
              Pro Component Kit
            </span>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {!isMobile && (
            <nav className="flex items-center gap-0.5 rounded-xl border border-border/20 bg-muted/40 p-1">
              {links.map((link) => (
                <HeaderLink
                  key={link.href}
                  text={link.text}
                  href={link.href}
                  isNew={link.isNew}
                  isActive={link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href)}
                />
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <a
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 text-muted-foreground transition-all hover:border-border/80 hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              href="https://github.com/vip-js/tmikit-ui"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">GitHub</span>
              <RiGithubFill size={18} />
            </a>
            <ThemeToggle />

            {isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 bg-transparent transition-all hover:border-border/50 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2">
                    <RiMenu2Line className="size-4" size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-border/30">
                  {links.map((link) => (
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg focus:bg-muted/50 focus:outline-none"
                      key={link.href}
                      asChild
                    >
                      <HeaderLink text={link.text} href={link.href} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
