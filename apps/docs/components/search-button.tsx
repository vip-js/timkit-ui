'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RiSearch2Line } from '@remixicon/react'

export default function SearchButton() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        router.push('/search')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return (
    <Link
      href="/search"
      className="group inline-flex h-11 min-w-72 cursor-text items-center gap-3 rounded-full border border-border/70 bg-card/70 px-4 text-sm text-foreground shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:border-primary/50 hover:bg-card focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
    >
      <span className="flex grow items-center gap-2">
        <RiSearch2Line className="text-muted-foreground -ms-1" size={20} aria-hidden="true" />
        <span className="text-muted-foreground">搜索组件、区块或布局…</span>
        <div className="pointer-events-none ml-auto hidden items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:flex">
          <span className="opacity-70">⌘</span>K
        </div>
      </span>
    </Link>
  )
}
