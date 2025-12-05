import fs from "fs"
import path from "path"
import registry from "@/data/registry-all.json"
import matter from "gray-matter"
import type { MDXRemoteSerializeResult } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import type { RegistryItem } from "shadcn/registry"

import { getCategories, getSections } from "@/lib/catalog"
import { extractSectionCode, type SectionCodeGroup } from "@/lib/sections"
import { getComponentsByNames } from "@/lib/utils"

type Variant = "registry" | "section"

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
  id: "shadcn" | "sections"
  title: string
  description: string
  total: number
  groups: UnifiedGroup[]
}

const loadSectionGroups = async (): Promise<UnifiedFamily> => {
  const sections = getSections()
  const groups: UnifiedGroup[] = []
  let total = 0

  // Filter items that are from componentsDB (we can identify them by some property or just by name convention if we had one)
  // For now, let's assume we can find them in registry.items
  // In the script we added them with type "registry:component" and files pointing to componentsDB

  // Actually, since we don't have a clear distinction in the unified registry object itself (except maybe file path),
  // we might need to rely on the fact that we merged them.
  // However, the current registry-all.json structure is flat.

  // Let's iterate over sections and find matching items in registry
  for (const section of sections) {
    const slug = section.slug.replace(/^\//, "")

    // Find items that belong to this section.
    // In the build script, we didn't explicitly add "section" metadata.
    // We relied on file path: componentsDB/{category}/{file}

    const sectionItems = registry.items.filter((item) => {
      return item.files?.some((f) => f.path.includes(`componentsDB/${slug}`))
    })

    if (sectionItems.length === 0) continue

    const entries: UnifiedEntry[] = []

    for (const [index, item] of sectionItems.entries()) {
      // We need MDX source. Since we are in Next.js, we can't easily read FS if we want to be "pure".
      // But for now, we still need to read the file content to get MDX.
      // The registry item has the path.

      // If we want to be truly "data driven", the registry-all.json should contain the compiled MDX or content.
      // But that makes the JSON huge.
      // So we will read the file from the path specified in the registry item.

      const filePath = path.join(process.cwd(), "apps/docs", item.files[0].path)

      try {
        if (!fs.existsSync(filePath)) continue
        const raw = fs.readFileSync(filePath, "utf-8")
        const { data: frontMatter, content } = matter(raw)
        if (frontMatter.isActive === false) continue
        const mdxSource = await serialize(content)
        const id = `${slug}-${index}`

        entries.push({
          id,
          title: frontMatter.title ?? item.name,
          description: frontMatter.description ?? section.description,
          variant: "section",
          mdxSource,
          codeGroups: extractSectionCode(frontMatter.ltr, id),
        })
      } catch (e) {
        console.warn(`Failed to load section item ${item.name}`, e)
      }
    }

    if (entries.length) {
      groups.push({
        id: slug,
        title: section.section_name,
        slug,
        href: `/components/${slug}`,
        count: entries.length,
        variant: "section",
        entries,
      })
      total += entries.length
    }
  }

  return {
    id: "sections",
    title: "页面区块库 (Sections)",
    description: "复用型页面区块，含多框架代码片段。",
    total,
    groups,
  }
}

const loadShadcnGroups = (): UnifiedFamily => {
  const categories = getCategories()
  const groups: UnifiedGroup[] = []
  let total = 0

  for (const category of categories) {
    const components = getComponentsByNames(
      category.components.map((item) => item.name)
    )

    const entries: UnifiedEntry[] = components.map((component) => ({
      id: component.name,
      title: component.name,
      variant: "registry",
      component,
    }))

    groups.push({
      id: category.slug,
      title: category.name,
      slug: category.slug,
      href: `/${category.slug}`,
      count: entries.length,
      variant: "registry",
      entries,
    })

    total += entries.length
  }

  return {
    id: "shadcn",
    title: "Shadcn 套件 (Web)",
    description: "基础控件与组合件，适配 Tailwind v4。",
    total,
    groups,
  }
}

export const getUnifiedFamilies = async (): Promise<UnifiedFamily[]> => {
  const shadcn = loadShadcnGroups()
  const sections = await loadSectionGroups()
  return [shadcn, sections]
}

export const getRegistryCount = () => registry.items.length
