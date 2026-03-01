'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

import IconAlpinejs from '@/components/icons/IconAlpinejs'
import IconZag from '@/components/icons/IconZag'

type Feature = {
  title: string
  desc: string
  icon: ReactNode | string
  href: string
}

const SupportedLibraries = () => {
  const features: Feature[] = [
    {
      title: 'Zag.js',
      desc: 'Universal state machines for accessible, interactive and performant UI components.',
      icon: <IconZag />,
      href: 'https://zagjs.com/',
    },
    {
      title: 'Alpine.js',
      desc: 'Alpine is a rugged, minimal tool for composing behavior directly in your markup.',
      icon: <IconAlpinejs />,
      href: 'https://alpinejs.dev/',
    },
  ]

  return (
    <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2">
      {features.map((item: Feature, key: number) => (
        <Link
          href={item.href}
          key={key}
          target="_blank"
          className="group relative w-full space-y-3 rounded-2xl border border-border/60 bg-card/80 p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.3)] transition hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 text-foreground transition group-hover:scale-[1.02]">
            {item.icon}
          </div>
          <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.desc}</p>
        </Link>
      ))}
    </div>
  )
}

export default SupportedLibraries
