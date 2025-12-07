'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import IconAlpinejs from '@/components/icons/IconAlpinejs'
import IconRadix from '@/components/icons/IconRadix'
import IconRadixVue from '@/components/icons/IconRadixVue'

type Feature = {
  title: string
  desc: string
  icon: ReactNode | string
  href: string
}

const SupportedLibraries = () => {
  const features: Feature[] = [
    {
      title: 'Radix UI',
      desc: 'Unstyled, accessible, open source React primitives for high-quality web apps and design systems.',
      icon: <IconRadix />,
      href: 'https://www.radix-ui.com/',
    },
    {
      title: 'Radix Vue',
      desc: 'Unstyled, accessible components for building high‑quality design systems and web apps in Vue.',
      icon: <IconRadixVue />,
      href: 'https://www.radix-vue.com/',
    },
    {
      title: 'Radix Svelte',
      desc: 'An open-source Svelte library for building high-quality, accessible design systems and web apps.',
      icon: <MeltUILogo />,
      href: 'https://www.melt-ui.com/',
    },
    {
      title: 'Alpine.js',
      desc: 'Alpine is a rugged, minimal tool for composing behavior directly in your markup.',
      icon: <IconAlpinejs />,
      href: 'https://alpinejs.dev/',
    },
  ]

  return (
    <div className="mx-auto mt-8 max-w-7xl grid-cols-2 gap-6 space-y-6 sm:grid sm:space-y-0 lg:grid-cols-3">
      {features.map((item: Feature, key: number) => (
        <Link
          href={item.href}
          key={key}
          target="_blank"
          className="relative w-full space-y-3 rounded-lg border border-zinc-800 bg-[linear-gradient(180deg,_rgba(24,_24,_27,_0.60)_0%,_rgba(24,_24,_27,_0.00)_100%)] p-5 no-underline duration-200 hover:bg-zinc-900"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700 bg-[linear-gradient(180deg,_rgba(39,_39,_42,_0.68)_100%,_rgba(39,_39,_42,_0.00)_100%)] text-gray-500">
            {item.icon}
          </div>
          <h3 className="text-base font-semibold text-zinc-100">{item.title}</h3>
          <p className="text-sm text-zinc-300">{item.desc}</p>
        </Link>
      ))}
    </div>
  )
}

function MeltUILogo() {
  return (
    <Image
      src="https://avatars.githubusercontent.com/u/134972826?s=200&v=4"
      width={50}
      height={50}
      alt="Melt UI"
      className="rounded-full"
    />
  )
}

export default SupportedLibraries
