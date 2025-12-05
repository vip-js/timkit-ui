"use client"

import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import mergeTW from "@/utils/mergeTW"
import { ChevronRightIcon } from "@heroicons/react/20/solid"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

import type { CatalogSection } from "@/lib/catalog"
import { getSections } from "@/lib/catalog"
import { Input } from "@/components/ui/input"

import NavLink from "./NavLink"

const Heading = ({ children }: { children: ReactNode }) => (
  <h3 className="pb-6 font-medium text-zinc-50">{children}</h3>
)

const NavList = ({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) => (
  <ul
    className={mergeTW(
      "relative after:absolute after:top-0 after:left-3 after:h-full after:w-px after:bg-zinc-800",
      className
    )}
  >
    {children}
  </ul>
)

const sections = getSections()

export default () => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>("")
  const [searchResults, setSearchResults] = useState<
    { section_name: string; slug: string }[]
  >([])

  const pathname = usePathname()

  const appUISections = useMemo(
    () =>
      sections.filter(
        (item: CatalogSection) => item.category === "Application"
      ),
    []
  )
  const marketingUISections = useMemo(
    () =>
      sections.filter((item: CatalogSection) => item.category === "Marketing"),
    []
  )

  useEffect(() => {
    setOpen(false)
    setSearchValue("")
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
    <div className="fixed inset-x-0 top-16 z-40 w-full flex-none xl:relative xl:inset-x-[unset] xl:top-0 xl:max-w-[16rem]">
      <div className="border-y border-zinc-800 bg-zinc-950 px-4 py-2.5 xl:hidden xl:px-8">
        <button
          className="flex items-center gap-x-2 text-gray-300"
          onClick={() => setOpen(!isOpen)}
        >
          <ChevronRightIcon
            className={`h-5 w-5 duration-200 ${isOpen ? "rotate-90" : ""}`}
          />
          Menu
        </button>
      </div>
      <aside className="relative w-full">
        <div
          className={`fixed inset-x-0 h-full w-full border-r border-zinc-800 bg-zinc-950 px-4 xl:inset-x-[unset] xl:top-auto xl:block xl:max-w-[16rem] xl:px-0 ${
            isOpen ? "" : "hidden"
          }`}
        >
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
                  <div className="font-medium text-zinc-400">
                    No components found
                  </div>
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
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
