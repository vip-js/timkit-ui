'use client'

import Link from 'next/link'
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
  { text: 'Blocks', href: '/components#sections' },
  { text: 'Layouts', href: '/layouts', isNew: true },
  { text: 'Easing Classes', href: '/easings' },
]

export default function Header() {
  const isMobile = useIsMobile()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center text-sm px-4 md:px-6">
        <Link className="shrink-0" href="/" aria-label="首页">
          <span className="dark:hidden">Timkit UI</span>
          <span className="hidden dark:block">Timkit UI</span>
        </Link>
        <div className="flex items-center ml-auto">
          {!isMobile && (
            <>
              <div className="flex items-center gap-4 md:gap-10">
                {links.map((link) => (
                  <HeaderLink
                    key={link.href}
                    text={link.text}
                    href={link.href}
                    isNew={link.isNew}
                  />
                ))}
              </div>
              <div className="bg-input ms-4 me-4 h-5 w-px md:ms-10" aria-hidden="true"></div>
            </>
          )}
          <div className="flex items-center gap-1">
            <a
              className="text-muted-foreground hover:text-foreground/80 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex size-9 items-center justify-center rounded outline-none focus-visible:ring-[3px]"
              href="https://github.com/origin-space/originui"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">GitHub</span>
              <RiGithubFill size={20} />
            </a>
            <ThemeToggle />
            {isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground/80 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex size-9 items-center justify-center rounded outline-none focus-visible:ring-[3px]">
                    <RiMenu2Line className="size-5" size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {links.map((link) => (
                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-transparent focus:underline"
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
