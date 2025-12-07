'use client'

import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import mergeTW from '@/utils/mergeTW'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input } from '@timui/react'

import type { CatalogSection } from '@/lib/catalog'
import { getCategories, getSections } from '@/lib/catalog'

import NavLink from './NavLink'

const Heading = ({ children }: { children: ReactNode }) => (
  <h3 className="pb-6 font-medium text-zinc-50">{children}</h3>
)

const NavList = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <ul
    className={mergeTW(
      'relative after:absolute after:top-0 after:left-3 after:h-full after:w-px after:bg-zinc-800',
      className
    )}
  >
    {children}
  </ul>
)

const sections = getSections()
const categories = getCategories()

const Sidebar = ({ className }: { className?: string }) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchResults, setSearchResults] = useState<{ section_name: string; slug: string }[]>([])

  const pathname = usePathname()

  const appUISections = useMemo(
    () =>
      sections.filter((item: CatalogSection) => item.category === 'Application' && item.count > 0),
    []
  )
  const marketingUISections = useMemo(
    () =>
      sections.filter((item: CatalogSection) => item.category === 'Marketing' && item.count > 0),
    []
  )

  useEffect(() => {
    setOpen(false)
    setSearchValue('')
    setSearchResults([])
  }, [pathname])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value
    setSearchValue(value)

    const getResults = sections.filter((item: CatalogSection) =>
      item.section_name.toLocaleLowerCase().includes(value.toLowerCase())
    )
    setSearchResults(getResults)
  }

  return (
    <aside
      className={mergeTW(
        'fixed inset-x-0 top-16 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r border-border/40 bg-background md:sticky md:block',
        className || ''
      )}
    >
      <div className="h-full overflow-y-auto py-6 pr-6 lg:py-8">
        <div className="pt-10 pr-4 pb-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-zinc-500" />
            <Input
              required
              placeholder="Search..."
              className="w-full border-zinc-700 pl-12"
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="h-full overflow-y-auto pt-4 pr-4 pb-32 text-sm text-gray-400 xl:pb-28 [&>*]:pt-6">
          {searchValue ? (
            <div className="">
              <Heading>Results</Heading>
              {searchResults.length > 0 ? (
                <NavList>
                  {searchResults.map((item, idx) => (
                    <li key={idx}>
                      <NavLink
                        href={`/components${item.slug}`}
                        className="hover:bg-zinc-900 hover:text-zinc-100"
                        active="bg-zinc-900 text-zinc-100 font-medium"
                      >
                        {item.section_name}
                      </NavLink>
                    </li>
                  ))}
                </NavList>
              ) : (
                <div className="font-medium text-zinc-400">No components found</div>
              )}
            </div>
          ) : (
            <></>
          )}
          {!searchValue ? (
            <>
              <div className="">
                <Heading>Getting Started</Heading>
                <NavList>
                  <li>
                    <NavLink
                      href="/components"
                      className="hover:bg-zinc-900 hover:text-zinc-100"
                      active="bg-zinc-900 text-zinc-100 font-medium"
                    >
                      Introduction
                    </NavLink>
                  </li>
                </NavList>
              </div>
              <div className="">
                <Heading>Components (Base UI)</Heading>
                <NavList>
                  {categories.map((item, idx) => (
                    <li key={idx}>
                      <NavLink
                        href={`/components/${item.slug}`}
                        className="hover:bg-zinc-900 hover:text-zinc-100"
                        active="bg-zinc-900 text-zinc-100 font-medium"
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </NavList>
              </div>
              {marketingUISections.length > 0 && (
                <div className="">
                  <Heading>Marketing UI</Heading>
                  <NavList>
                    {marketingUISections.map((item, idx) => (
                      <li key={idx}>
                        <NavLink
                          href={`/components${item.slug}`}
                          className="hover:bg-zinc-900 hover:text-zinc-100"
                          active="bg-zinc-900 text-zinc-100 font-medium"
                        >
                          {item.section_name}
                        </NavLink>
                      </li>
                    ))}
                  </NavList>
                </div>
              )}
              {appUISections.length > 0 && (
                <div className="">
                  <Heading>Application UI</Heading>
                  <NavList>
                    {appUISections.map((item, idx) => (
                      <li key={idx}>
                        <NavLink
                          href={`/components${item.slug}`}
                          className="hover:bg-zinc-900 hover:text-zinc-100"
                          active="bg-zinc-900 text-zinc-100 font-medium"
                        >
                          {item.section_name}
                        </NavLink>
                      </li>
                    ))}
                  </NavList>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
