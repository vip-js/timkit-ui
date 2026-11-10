import fs from 'fs'
import React from 'react'
import type { JSX } from 'react'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { JsonValue } from '@timui/core'

import { getCategoryBySlug, getSectionBySlug, getSections } from '@/lib/catalog'
import { disambiguateDemoTitles, resolveDemoDisplayTitle } from '@/lib/demo-title'
import { getDocsFrameworkPreviewHints } from '@/lib/framework-preview-server'
import { adaptRegistryItemToComponentData } from '@/lib/registry-adapter'
import { getRegistryIndexItems, loadRegistryItemFromData } from '@/lib/registry-index'
import { extractSectionCode } from '@/lib/sections'
import { ComponentApiReference } from '@/components/component-api-reference'
import { ContractNote, KeyboardNote, contractNote, keyboardNote } from '@/components/keyboard-note'
import { DocsSectionHeader } from '@/components/docs-section'
import { ComponentPageHeader } from '@/components/component-page-header'
import ComponentPreviewLazy from '@/components/component-preview-lazy'
// ...

import type { ComponentData } from '@/components/preview/preview-app'
import { DashboardTableOfContents } from '@/components/toc'

type Params = { slug: string }

type PageDetails = {
  description?: string
  section_name?: string
  title?: string
  name?: string
  components?: Array<{ name: string }>
}

const resolvePageDetails = (slug: string): PageDetails | null => {
  const section = getSectionBySlug(`/${slug}`)
  if (section) return section as PageDetails
  const category = getCategoryBySlug(slug)
  if (category) return category as PageDetails
  return null
}

const getMetaString = (meta: Record<string, JsonValue> | undefined, key: string): string => {
  const value = meta?.[key]
  return typeof value === 'string' ? value : ''
}

const shouldProfile =
  process.env.TIMUI_PROFILE === '1' || process.env.NEXT_PUBLIC_TIMUI_PROFILE === '1'
const profileStarts = new Map<string, number>()
const logProfile = (message: string) => {
  if (!shouldProfile) return
  try {
    // Write to a temp file so we can see logs even if Next suppresses stdout.
    fs.appendFileSync('/tmp/timui-profile.log', `${message}\n`, 'utf-8')
  } catch {
    // ignore
  }
}
const markStart = (label: string) => {
  if (!shouldProfile) return
  profileStarts.set(label, Date.now())
  logProfile(`[start] ${label}`)
}
const markEnd = (label: string) => {
  if (!shouldProfile) return
  const start = profileStarts.get(label)
  const duration = start ? Date.now() - start : -1
  logProfile(`[end] ${label} ${duration}ms`)
}
if (shouldProfile) {
  logProfile('[timui-profile] components page profiling enabled')
}

export async function generateStaticParams() {
  return getSections().map((item) => ({
    slug: item.slug.slice(1),
  }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params

  const pageDetails = resolvePageDetails(slug)

  if (!pageDetails) {
    return {
      title: 'Page Not Found',
      description: '',
    }
  }

  const title = `${pageDetails.section_name || pageDetails.title || pageDetails.name || slug} - Tailwind CSS Components`

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
  markStart('components-page:total')
  try {
    logProfile('[timui-profile] rendering components page')
    const { slug } = await params

    /* 1. Find Page Configuration (Section OR Category) */
    markStart('components-page:find-page')
    const pageDetails = resolvePageDetails(slug)

    if (!pageDetails) {
      markEnd('components-page:find-page')
      return notFound()
    }
    markEnd('components-page:find-page')

    /* 2. Get Component Names from Catalog */
    markStart('components-page:catalog')
    const catalogComponentNames = new Set((pageDetails.components || []).map((c) => c.name))
    markEnd('components-page:catalog')

    markStart('components-page:registry-index')
    const indexItems = getRegistryIndexItems()
    markEnd('components-page:registry-index')

    markStart('components-page:filter-items')
    const sectionItems = indexItems.filter((item) => {
      const meta = item.meta as Record<string, JsonValue> | undefined
      const isCategoryMatch =
        item.categories?.includes(slug) || getMetaString(meta, 'category') === slug
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
    markEnd('components-page:filter-items')

    if (!sectionItems.length) {
      return notFound()
    }

    /* New: Attempt to read MDX from filesystem */
    markStart('components-page:load-components')
    const components: ComponentData[] = await Promise.all(
      sectionItems.map(async (itemMeta) => {
        markStart(`components-page:load:${itemMeta.name}`)
        const fullItem = loadRegistryItemFromData(itemMeta.name) || itemMeta
        const meta = fullItem.meta as Record<string, JsonValue> | undefined

        let mdxBody = getMetaString(meta, 'mdxBody') || getMetaString(meta, 'ltr')

        // Try reading local MDX file
        try {
          const fs = await import('fs')
          const path = await import('path')
          const mdxPath = path.join(process.cwd(), 'content/docs/components', `${slug}.mdx`)
          if (fs.existsSync(mdxPath)) {
            mdxBody = fs.readFileSync(mdxPath, 'utf-8')
          }
        } catch (e) {
          // ignore
        }

        // NO SERIALIZE - Pass raw string
        const mdxSource = mdxBody
        markStart(`components-page:code:${itemMeta.name}`)
        const codeGroups = extractSectionCode((meta?.ltr ?? {}) as object, fullItem.name)
        markEnd(`components-page:code:${itemMeta.name}`)

        markStart(`components-page:adapt:${itemMeta.name}`)
        // Adapt registry item to docs structure
        const adapted = adaptRegistryItemToComponentData(fullItem, slug)
        markEnd(`components-page:adapt:${itemMeta.name}`)

        markEnd(`components-page:load:${itemMeta.name}`)
        return {
          ...adapted,
          id: `${slug}-${fullItem.name}`,
          sourceName: fullItem.name,
          mdxSource,
          codeGroups: codeGroups.length ? codeGroups : adapted.codeGroups || [],
          // Keep demo naming stable by deriving component key from demo filename.
          // Example: accordion-01 -> accordion, calendar-date-picker-03 -> calendar-date-picker
          // This avoids using route slug like "inputs", which is too broad for demo titles.
          title: resolveDemoDisplayTitle(
            fullItem.name.replace(/-\d{1,3}$/, ''),
            fullItem.name,
            fullItem.files,
            getMetaString(meta, 'title') || adapted.title
          ),
        }
      })
    )
    markEnd('components-page:load-components')

    markStart('components-page:mdx-components')
    const sectionComponents = disambiguateDemoTitles(
      components.filter((component) => component.isActive !== false)
    )
    markEnd('components-page:mdx-components')

    const apiRegistryItem =
      loadRegistryItemFromData(slug) ||
      indexItems.find(
        (item) =>
          item.name === slug && (item.type === 'registry:ui' || item.type === 'registry:component')
      )

    let apiReferenceDoc: React.ReactNode = null
    const apiSource = sectionComponents[0]?.mdxSource
    const apiSourceText = typeof apiSource === 'string' ? apiSource : ''
    if (apiSourceText.trim()) {
      markStart('components-page:markdoc')
      const { renderMarkdoc } = await import('@/lib/markdoc')
      apiReferenceDoc = renderMarkdoc(apiSourceText)
      markEnd('components-page:markdoc')
    }

    // 4. Render Page
    /* 4. Construct TOC */
    const toc = [
      { title: '安装', url: '#installation' },
      { title: '用法', url: '#usage' },
      {
        title: '示例',
        url: '#examples',
        items: sectionComponents.map((component) => ({
          title: component.title || '',
          url: `#example-${component.id}`,
        })),
      },
      { title: 'API', url: '#api-reference' },
      ...(keyboardNote(slug) ? [{ title: '键盘', url: '#keyboard' }] : []),
      ...(contractNote(slug) ? [{ title: '契约', url: '#contract' }] : []),
    ]

    const pageTitle = pageDetails.section_name || pageDetails.name || slug

    // 5. Render Page
    return (
      <main className="relative lg:gap-10 xl:grid xl:grid-cols-[minmax(0,1fr)_180px]">
        <div className="mx-auto w-full min-w-0 max-w-[46rem] xl:max-w-none">
          <ComponentPageHeader
            title={pageTitle}
            description={pageDetails.description}
            slug={slug}
          />

          {/* 2. Middle Section: Examples Grid */}
          <section id="examples" className="mt-12 space-y-6">
            <DocsSectionHeader
              title="Examples"
              kicker="示例"
              subtitle="每个示例均可切换预览与源码，并支持 React、Vue、HTML 与小程序（若已提供）。"
            />
            <div className="space-y-8">
              {sectionComponents.map((component) => {
                const fallbackFromId =
                  typeof component.id === 'string' && component.id.startsWith(`${slug}-`)
                    ? component.id.slice(slug.length + 1)
                    : undefined
                const previewName =
                  component.sourceName || fallbackFromId || component.slug || component.title
                const resolvedPreviewName = String(
                  previewName || component.id || component.title || slug
                )
                return (
                  <article
                    key={component.id}
                    id={`example-${component.id}`}
                    className="min-w-0 scroll-mt-24"
                  >
                    <h3 className="mb-3 text-sm font-medium text-foreground">{component.title}</h3>
                    <ComponentPreviewLazy
                      componentName={resolvedPreviewName}
                      previewHints={getDocsFrameworkPreviewHints(resolvedPreviewName)}
                      className="my-0 gap-3"
                    />
                  </article>
                )
              })}
            </div>
          </section>

          {/* 3. Bottom Section: API Reference */}
          <section id="api-reference" className="mt-16 border-t border-border/40 pt-10 space-y-8">
            <div>
              <DocsSectionHeader
                title="Structured API"
                kicker="结构化 API"
                subtitle="与 UCS schema 对齐的 props、逻辑机与多框架运行时。"
                className="mb-6"
              />
              <ComponentApiReference
                slug={slug}
                sectionComponents={sectionComponents}
                registryItem={apiRegistryItem}
              />
            </div>

            {sectionComponents[0]?.mdxSource ? (
              <>
                <DocsSectionHeader title="Extended Notes" kicker="扩展说明" className="mb-5" />
                <div className="mdx prose prose-slate max-w-none prose-headings:scroll-m-20 prose-headings:font-semibold prose-p:leading-relaxed prose-li:leading-relaxed prose-code:font-mono prose-code:bg-muted/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[12px] prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-950/98 prose-pre:border prose-pre:border-border/15 prose-pre:rounded-xl">
                  {apiReferenceDoc}
                </div>
              </>
            ) : (
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                该组件尚无扩展说明文档。
              </p>
            )}
          </section>

          <KeyboardNote slug={slug} />
          <ContractNote slug={slug} />
        </div>

        {/* Right Sidebar TOC - Should be dynamic based on MDX? For now static is fine */}
        <div className="hidden text-[12px] xl:block">
          <div className="sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-auto pt-3">
            <DashboardTableOfContents toc={toc} />
          </div>
        </div>
      </main>
    )
  } finally {
    markEnd('components-page:total')
  }
}
