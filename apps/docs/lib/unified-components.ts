import type { RegistryItem } from '@timui/core'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

import { catalog } from '@/lib/catalog'
import { getIndexItems, getUiItems } from '@/lib/registry-data'
import { loadRegistryItemFromData } from '@/lib/registry-index'
import { extractSectionCode, type SectionCodeGroup } from '@/lib/sections'

type Variant = 'registry' | 'section'

export type UnifiedEntry = {
  id: string
  title: string
  description?: string
  variant: Variant
  component?: RegistryItem
  mdxSource?: MDXRemoteSerializeResult
  codeGroups?: SectionCodeGroup[]
}

export type UnifiedGroup = {
  id: string
  title: string
  slug: string
  href: string
  count: number
  variant: Variant
  entries: UnifiedEntry[]
}

export type UnifiedFamily = {
  id: 'shadcn' | 'sections'
  title: string
  description: string
  total: number
  groups: UnifiedGroup[]
}

export const getUnifiedFamilies = async (): Promise<UnifiedFamily[]> => {
  const uiItems = getUiItems()
  const uiNameSet = new Set(uiItems.map((item: any) => item.name))
  const indexItems = getIndexItems()

  // 1. Load Shadcn Family (UI Components)
  // We derive this purely from registry.items where type is 'registry:ui' or 'registry:component'
  // AND from catalog.categories structure which gives us the order/grouping.

  const shadcnGroups: UnifiedGroup[] = []
  let shadcnTotal = 0

  if (catalog.categories) {
    for (const cat of catalog.categories) {
      // Preferred lookup: by catalog.components name list
      const nameSet = new Set((cat.components || []).map((c: any) => c.name))
      const categoryItems = indexItems.filter(
        (item: any) =>
          (item.type === 'registry:ui' || item.type === 'registry:component') &&
          (nameSet.has(item.name) ||
            item.categories?.includes(cat.slug) ||
            item.meta?.category === cat.slug)
      )

      const entries: UnifiedEntry[] = categoryItems.map((item: any) => {
        const fullItem = (loadRegistryItemFromData(item.name) || item) as RegistryItem
        return {
          id: item.name,
          title: item.name,
          variant: 'registry',
          component: fullItem,
        }
      })

      if (entries.length > 0) {
        shadcnGroups.push({
          id: cat.slug,
          title: cat.name,
          slug: cat.slug,
          href: `/components/${cat.slug}`,
          count: entries.length,
          variant: 'registry',
          entries,
        })
        shadcnTotal += entries.length
      }
    }
  }

  const shadcnFamily: UnifiedFamily = {
    id: 'shadcn',
    title: 'Shadcn 套件 (Web)',
    description: '基础控件与组合件，适配 Tailwind v4。',
    total: shadcnTotal,
    groups: shadcnGroups,
  }

  // 2. Load Sections Family (Blocks)
  const sectionGroups: UnifiedGroup[] = []
  let sectionTotal = 0

  if (catalog.sections) {
    for (const section of catalog.sections) {
      const slug = section.slug.replace(/^\//, '')

      // Find items
      const sectionItems = indexItems.filter(
        (item: any) => item.categories?.includes(slug) || item.meta?.category === slug
      )

      const sectionItemPromises = sectionItems.map(async (item: any, index: number) => {
        // Skip if a UI component with the same name exists (de-dup shadcn vs float)
        if (uiNameSet.has(item.name)) return null
        const meta = item.meta as any
        // Only process if we have MDX body (for sections)
        if (!meta?.mdxBody) return null
        if (meta?.isActive === false) return null

        try {
          const mdxSource = await serialize(meta.mdxBody)
          const id = `${slug}-${index}`
          return {
            id,
            title: meta.title ?? item.name,
            description: meta.description ?? section.description,
            variant: 'section' as Variant,
            mdxSource,
            codeGroups: extractSectionCode(meta.ltr, id),
          }
        } catch (e) {
          console.warn(`Failed to process section item ${item.name}`, e)
          return null
        }
      })

      const resolvedEntries: (UnifiedEntry | null)[] = await Promise.all(sectionItemPromises)
      const entries = resolvedEntries.filter((entry): entry is UnifiedEntry => entry !== null)

      if (entries.length > 0) {
        sectionGroups.push({
          id: slug,
          title: section.section_name,
          slug,
          href: `/components/${slug}`,
          count: entries.length,
          variant: 'section',
          entries,
        })
        sectionTotal += entries.length
      }
    }
  }

  const sectionFamily: UnifiedFamily = {
    id: 'sections',
    title: '页面区块库 (Sections)',
    description: '复用型页面区块，含多框架代码片段。',
    total: sectionTotal,
    groups: sectionGroups,
  }

  return [shadcnFamily, sectionFamily]
}

export const getRegistryCount = () => getUiItems().length
