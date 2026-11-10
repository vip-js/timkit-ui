export type DemoKind = 'form' | 'overlay' | 'data' | 'control'

const FORM = [
  'form',
  'input',
  'textarea',
  'select',
  'select-native',
  'checkbox',
  'switch',
  'radio',
  'radio-group',
  'slider',
  'tags-input',
  'date-picker',
  'datefield',
  'datefield-rac',
  'calendar',
  'calendar-rac',
  'combobox',
  'multiselect',
  'label',
]

const OVERLAY = [
  'dialog',
  'sheet',
  'popover',
  'tooltip',
  'hover-card',
  'dropdown',
  'dropdown-menu',
  'alert-dialog',
  'toast',
  'sonner',
  'command',
]

const DATA = [
  'table',
  'data-table',
  'card',
  'avatar',
  'badge',
  'timeline',
  'progress',
  'breadcrumb',
  'pagination',
  'accordion',
  'tabs',
  'alert',
  'banner',
  'notification',
  'stepper',
  'tree',
  'checkbox-tree',
  'scroll-area',
  'separator',
  'navigation-menu',
  'collapsible',
]

function baseName(name: string) {
  return name
    .toLowerCase()
    .split('/')
    .pop()!
    .replace(/\.(tsx|vue|html|wxml)$/, '')
    .replace(/-\d{1,3}$/, '')
    .replace(/-demo$/, '')
}

function matches(base: string, names: string[]) {
  return names.some((name) => base === name || base.startsWith(`${name}-`))
}

export function demoKindFromName(name: string | undefined | null): DemoKind {
  const base = baseName(name || '')
  if (!base) return 'control'
  if (matches(base, OVERLAY)) return 'overlay'
  if (matches(base, FORM)) return 'form'
  if (matches(base, DATA) || base.includes('table')) return 'data'
  return 'control'
}

export function demoStageClass(kind: DemoKind) {
  if (kind === 'form' || kind === 'data') return 'items-stretch justify-start'
  if (kind === 'overlay') return 'items-center justify-center'
  return 'items-center justify-center'
}

export function demoCanvasClass(kind: DemoKind) {
  if (kind === 'form') return 'mx-auto w-full max-w-md [&_form]:grid [&_form]:gap-3'
  if (kind === 'data') return 'w-full max-w-none overflow-x-auto [&_table]:w-full'
  if (kind === 'overlay') return 'flex min-h-40 w-full items-center justify-center'
  return 'flex w-full items-center justify-center'
}
