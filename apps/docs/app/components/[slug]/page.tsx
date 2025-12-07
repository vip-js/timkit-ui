import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RegistryItem } from '@timui/core'
import { serialize } from 'next-mdx-remote/serialize'

import { getCategoryBySlug, getSectionBySlug, getSections } from '@/lib/catalog'
import { adaptRegistryItemToComponentData } from '@/lib/registry-adapter'
import { getRegistryIndexItems, loadRegistryItemFromData } from '@/lib/registry-index'
import { extractSectionCode } from '@/lib/sections'
import ComponentCard from '@/components/component-card'
import ComponentExample from '@/components/component-example'
import ComponentPreview from '@/components/component-preview'
import PageGrid from '@/components/page-grid'
import PageHeader from '@/components/page-header'
import type { ComponentData } from '@/components/preview/preview-app'

type Params = { slug: string }

type PageDetails = {
  description: string
  section_name: string
}

export async function generateStaticParams() {
  return getSections().map((item) => ({
    slug: item.slug.slice(1),
  }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params

  const pageDetails = getSectionBySlug(`/${slug}`) as PageDetails | undefined

  if (!pageDetails) {
    return {
      title: 'Page Not Found',
      description: '',
    }
  }

  const title = `${pageDetails.section_name} - Tailwind CSS Components`
  const description = pageDetails.description

  return {
    metadataBase: new URL('https://ui.timkit.cn'),
    alternates: { canonical: `/components/${slug}` },
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params

  /* 1. Find Page Configuration (Section OR Category) */
  const pageDetails = (getSectionBySlug(`/${slug}`) || getCategoryBySlug(slug)) as any

  if (!pageDetails) {
    return notFound()
  }

  /* 2. Get Component Names from Catalog */
  const catalogComponentNames = new Set((pageDetails.components || []).map((c: any) => c.name))

  const indexItems = getRegistryIndexItems()
  const sectionItems = indexItems.filter((item) => {
    const meta = item.meta as any
    const isCategoryMatch = item.categories?.includes(slug) || meta?.category === slug
    const isInCatalog = catalogComponentNames.has(item.name)

    // Match Sections (registry:block) AND Components (registry:ui/component)
    return (
      (item.type === 'registry:block' ||
        item.type === 'registry:ui' ||
        item.type === 'registry:component') &&
      (isCategoryMatch || isInCatalog) &&
      meta?.isActive !== false
    )
  })

  if (!sectionItems.length) {
    return notFound()
  }

  const components: ComponentData[] = await Promise.all(
    sectionItems.map(async (itemMeta) => {
      const fullItem = loadRegistryItemFromData(itemMeta.name) || itemMeta
      const meta = fullItem.meta as any
      const mdxBody = meta?.mdxBody || ''
      const mdxSource = await serialize(mdxBody)
      const codeGroups = extractSectionCode(meta?.ltr, fullItem.name)

      // Adapt registry item to docs structure
      const adapted = adaptRegistryItemToComponentData(fullItem, slug)

      return {
        ...adapted,
        id: `${slug}-${fullItem.name}`,
        mdxSource,
        codeGroups: codeGroups.length ? codeGroups : adapted.codeGroups || [],
        registryStub: fullItem as RegistryItem,
        title: meta?.title || adapted.title || fullItem.name,
      }
    })
  )

  const sectionComponents = components.filter((component) => component.isActive !== false)

  // 4. Render Page
  /* 4. Construct TOC */
  const toc = [
    { title: 'Preview', url: '#preview' },
    { title: 'Installation', url: '#installation' },
    { title: 'Usage', url: '#usage' },
    { title: 'API Reference', url: '#api-reference' },
  ]

  // 5. Render Page
  return (
    <main className="relative py-8 lg:gap-14 lg:py-12 xl:grid xl:grid-cols-[1fr_260px]">
      <div className="mx-auto w-full min-w-0">
        <PageHeader title={pageDetails.section_name || (pageDetails as any).name}>
          {pageDetails.description}
        </PageHeader>

        <div className="mt-8 space-y-10">
          {sectionComponents.map((component, idx) => (
            <div key={component.id} id={idx === 0 ? 'preview' : undefined}>
              {idx === 0 ? (
                // Primary Component (First one)
                <>
                  <div className="mb-6">
                    <ComponentPreview component={component.registryStub!} />
                  </div>

                  <div id="installation" className="scroll-m-20">
                    <h2 className="text-lg font-semibold tracking-tight mb-3">Installation</h2>
                    <div className="relative rounded-lg bg-zinc-950 border border-border p-4">
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-zinc-300">
                          npx @timui/cli add {component.registryStub?.name}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Mock Usage for now since we don't have explicit usage examples separately yet */}
                  <div id="usage" className="scroll-m-20 mt-8">
                    <h2 className="text-lg font-semibold tracking-tight mb-3">Usage</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Import the component and use it in your application.
                    </p>
                    <div className="relative rounded-lg bg-zinc-950 border border-border p-4">
                      <code className="text-sm font-mono text-zinc-300 block whitespace-pre">
                        {`import { ${component.registryStub?.name} } from "@/components/ui/${component.registryStub?.name}"`}
                      </code>
                    </div>
                  </div>

                  {/* API Reference */}
                  <div id="api-reference" className="scroll-m-20 mt-8">
                    <h2 className="text-lg font-semibold tracking-tight mb-3">API Reference</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Props and configuration options for the component.
                    </p>

                    {/* Placeholder API Table - In a real scenario, this data would come from the Registry or DocGen */}
                    <div className="my-6 w-full overflow-y-auto rounded-lg border border-border">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">
                              Prop
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[200px]">
                              Type
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">
                              Default
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          <tr className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 py-3 align-middle font-mono text-xs font-semibold text-primary">
                              className
                            </td>
                            <td className="p-4 py-3 align-middle font-mono text-xs text-muted-foreground">
                              <span className="rounded bg-muted px-1.5 py-0.5">string</span>
                            </td>
                            <td className="p-4 py-3 align-middle font-mono text-xs text-muted-foreground">
                              -
                            </td>
                            <td className="p-4 py-3 align-middle text-muted-foreground">
                              Optional CSS class names.
                            </td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 py-3 align-middle font-mono text-xs font-semibold text-primary">
                              asChild
                            </td>
                            <td className="p-4 py-3 align-middle font-mono text-xs text-muted-foreground">
                              <span className="rounded bg-muted px-1.5 py-0.5">boolean</span>
                            </td>
                            <td className="p-4 py-3 align-middle font-mono text-xs text-muted-foreground">
                              <span className="rounded bg-muted px-1.5 py-0.5">false</span>
                            </td>
                            <td className="p-4 py-3 align-middle text-muted-foreground">
                              Change the default rendered element for the one passed as a child.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                // Secondary Examples (Blocks etc)
                <div className="pt-10 border-t border-border mt-10">
                  <h3 className="text-base font-medium mb-4">{component.title}</h3>
                  <ComponentPreview component={component.registryStub!} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar TOC */}
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 pt-4">
          <div className="space-y-2">
            <p className="font-medium text-sm text-foreground">On This Page</p>
            <ul className="m-0 list-none text-sm space-y-1">
              {toc.map((item, index) => (
                <li key={index} className="mt-0 pt-2">
                  <a
                    href={item.url}
                    className="inline-block no-underline transition-colors hover:text-foreground text-muted-foreground"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
