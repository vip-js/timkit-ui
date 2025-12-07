import type { MetadataRoute } from 'next'

import { getCategories } from '@/lib/catalog'

export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: 'https://originui.com',
  }
  const search = {
    url: 'https://originui.com/search',
  }
  const easings = {
    url: 'https://originui.com/easings',
  }
  const categoryPages = getCategories().map((category) => ({
    url: `https://originui.com/${category.slug}`,
  }))

  return [home, ...categoryPages, search, easings]
}
