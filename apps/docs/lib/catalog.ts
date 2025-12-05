import catalogData from "@/catalog/catalog.json"

export type CatalogCategory = (typeof catalogData)["categories"][number]
export type CatalogSection = (typeof catalogData)["sections"][number]

export const catalog = catalogData

export const getCategories = () => catalog.categories

export const getCategoryBySlug = (slug: string) =>
  catalog.categories.find((category) => category.slug === slug)

export const getSections = () => catalog.sections

export const getSectionBySlug = (slug: string) =>
  catalog.sections.find((section) => section.slug === slug)
