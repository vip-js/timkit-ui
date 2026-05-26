import type { MetadataRoute } from 'next'

import { getCategories } from '@/lib/catalog'

export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: 'https://ui.timkit.cn',
  }
  const search = {
    url: 'https://ui.timkit.cn/search',
  }
  const easings = {
    url: 'https://ui.timkit.cn/easings',
  }
  const blocks = {
    url: 'https://ui.timkit.cn/blocks',
  }
  const templates = {
    url: 'https://ui.timkit.cn/templates',
  }
  const agents = {
    url: 'https://ui.timkit.cn/agents',
  }
  const categoryPages = getCategories().map((category) => ({
    url: `https://ui.timkit.cn/${category.slug}`,
  }))

  return [home, blocks, templates, agents, ...categoryPages, search, easings]
}
