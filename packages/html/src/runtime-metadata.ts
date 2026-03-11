import { htmlAdapterTemplateNames } from './capabilities'

export const HTML_RUNTIME_ROOT_ATTRIBUTE = 'data-timui-root' as const
export const HTML_RUNTIME_AUTO_ATTRIBUTE = 'data-timui-init' as const
export const HTML_RUNTIME_AUTO_VALUE = 'auto' as const

export const htmlRuntimeSelectorByName: Record<(typeof htmlAdapterTemplateNames)[number], string> =
  {
    accordion: '[data-slot="accordion"]',
    collapsible: '[data-slot="collapsible"]',
    'dropdown-menu': '[data-slot="dropdown-menu-trigger"]',
    'hover-card': '[data-slot="hover-card"]',
    'navigation-menu': '[data-slot="navigation-menu"]',
    popover: '[data-slot="popover"]',
    sheet: '[data-slot="sheet-root"]',
    switch: '[data-slot="switch"]',
    tabs: '[data-slot="tabs"]',
    toast: '[data-slot="toast"]',
    toggle: '[data-slot="toggle"]',
    'toggle-group': '[data-slot="toggle-group"]',
    tooltip: '[data-slot="tooltip-root"]',
  }

export function getHtmlInitializerName(name: string): string {
  return `init${name
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')}`
}
