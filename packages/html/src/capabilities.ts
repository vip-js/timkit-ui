export type HtmlCapabilityLevel = 'template-only' | 'template+adapter'

export const htmlAdapterTemplateNames = [
  'accordion',
  'collapsible',
  'dropdown-menu',
  'hover-card',
  'navigation-menu',
  'popover',
  'sheet',
  'switch',
  'tabs',
  'toast',
  'toggle',
  'toggle-group',
  'tooltip',
] as const

const htmlAdapterTemplateNameSet = new Set<string>(htmlAdapterTemplateNames)

export function getHtmlCapabilityLevel(name: string): HtmlCapabilityLevel {
  return htmlAdapterTemplateNameSet.has(name) ? 'template+adapter' : 'template-only'
}
