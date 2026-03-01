import catalogData from '@/data/catalog-all.json'

export type CatalogCategory = (typeof catalogData.categories)[number]
// Explicitly define CatalogSection to avoid 'never' type when JSON array is empty
export type CatalogSection = {
  id: string
  name: string
  slug: string
  description?: string
  items?: string[]
  category: string
  count: number
  section_name: string
}

export const catalog = {
  categories: catalogData.categories,
  sections: catalogData.sections as object as CatalogSection[],
}

export const getCategories = () =>
  [...catalog.categories].sort((a, b) => a.name.localeCompare(b.name))

export const getCategoryBySlug = (slug: string) =>
  catalog.categories.find((category) => category.slug === slug)

export const getSections = () =>
  [...catalog.sections].sort((a, b) => a.section_name.localeCompare(b.section_name))

export const getSectionBySlug = (slug: string) =>
  catalog.sections.find((section) => section.slug === slug)
