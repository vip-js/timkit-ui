'use client'

import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import mergeTW from '@/utils/merge-tw'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input } from '@timui/react'

import type { CatalogSection } from '@/lib/catalog'
import { getCategories, getSections } from '@/lib/catalog'

import NavLink from './NavLink'

const Heading = ({ children }: { children: ReactNode }) => (
  <h3 className="mb-2 px-3 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
    {children}
  </h3>
)

const NavList = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <ul className={mergeTW('flex flex-col gap-0.5', className)}>{children}</ul>
)

const sections = getSections()
const categories = getCategories()

const Sidebar = ({ className }: { className?: string }) => {
  /* Combined Search Source */
  const allItems = useMemo(
    () => [
      ...categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        type: 'Base',
        href: `/components/${c.slug}`,
      })),
      ...sections.map((s) => ({
        name: s.section_name,
        slug: s.slug,
        type: s.category,
        href: `/blocks${s.slug}`,
      })),
    ],
    []
  )

  const [isOpen, setOpen] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchResults, setSearchResults] = useState<typeof allItems>([])

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

    if (!value) {
      setSearchResults([])
      return
    }

    const getResults = allItems.filter((item) =>
      item.name.toLocaleLowerCase().includes(value.toLowerCase())
    )
    setSearchResults(getResults)
  }

  return (
    <aside
      className={mergeTW(
        'fixed inset-x-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:sticky md:flex',
        className || ''
      )}
    >
      {/* Fixed Search - Clean & Minimal */}
      <div className="relative px-3 py-3 shrink-0">
        <div className="relative group">
          <MagnifyingGlassIcon className="absolute inset-y-0 left-3 my-auto h-3.5 w-3.5 text-sidebar-foreground/40 transition-colors group-focus-within:text-sidebar-foreground/60" />
          <Input
            required
            placeholder="Search..."
            className="h-9 w-full rounded-md border-transparent bg-sidebar-accent/50 pl-9 text-[13px] text-sidebar-foreground shadow-none transition-all placeholder:text-sidebar-foreground/30 hover:bg-sidebar-accent/80 focus:bg-background focus:ring-1 focus:ring-sidebar-ring/20 focus:shadow-xs"
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-sidebar-border/40 hover:scrollbar-thumb-sidebar-border/60">
        <div className="flex flex-col gap-6 text-[13px] text-sidebar-foreground/80 xl:pb-10">
          {searchValue ? (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              <Heading>Search Results</Heading>
              {searchResults.length > 0 ? (
                <NavList>
                  {searchResults.map((item, idx) => (
                    <li key={idx}>
                      <NavLink href={item.href}>
                        <div className="flex w-full items-center justify-between">
                          <span>{item.name}</span>
                          <span className="text-[10px] font-medium opacity-40 uppercase tracking-tighter transition-opacity group-hover:opacity-100">
                            {item.type}
                          </span>
                        </div>
                      </NavLink>
                    </li>
                  ))}
                </NavList>
              ) : (
                <div className="px-3 py-2 text-sm text-sidebar-foreground/50">
                  No components found
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Introduction Section */}
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <NavList>
                  <li>
                    <NavLink href="/components">Introduction</NavLink>
                  </li>
                </NavList>
              </div>

              {/* Base UI */}
              <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                <Heading>Base UI</Heading>
                <NavList>
                  {categories.map((item, idx) => (
                    <li key={idx}>
                      <NavLink href={`/components/${item.slug}`}>{item.name}</NavLink>
                    </li>
                  ))}
                </NavList>
              </div>

              {/* Marketing UI */}
              {marketingUISections.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-400">
                  <Heading>Marketing UI</Heading>
                  <NavList>
                    {marketingUISections.map((item, idx) => (
                      <li key={idx}>
                        <NavLink href={`/blocks${item.slug}`}>{item.section_name}</NavLink>
                      </li>
                    ))}
                  </NavList>
                </div>
              )}

              {/* Application UI */}
              {appUISections.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-500">
                  <Heading>Application UI</Heading>
                  <NavList>
                    {appUISections.map((item, idx) => (
                      <li key={idx}>
                        <NavLink href={`/blocks${item.slug}`}>{item.section_name}</NavLink>
                      </li>
                    ))}
                  </NavList>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
