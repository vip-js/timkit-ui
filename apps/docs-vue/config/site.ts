export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    github: string
    twitter?: string
  }
}

export const siteConfig: SiteConfig = {
  name: 'Timkit',
  description: 'Beautiful and accessible components built with Zag.js',
  url: 'https://timui.com',
  ogImage: 'https://timui.com/og.png',
  links: {
    github: 'https://github.com/yourusername/timkit-ui',
  },
}

export default siteConfig
