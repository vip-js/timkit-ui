import type { ComponentName } from './component-names'

export type ComponentPartsMap = Partial<Record<ComponentName, readonly string[]>>

export const componentParts = {
  accordion: ['accordion-item'],
  alert: ['alert-description', 'alert-title'],
  avatar: ['avatar-fallback', 'avatar-image'],
  banner: ['banner-actions', 'banner-content', 'banner-description', 'banner-icon', 'banner-title'],
  breadcrumb: [
    'breadcrumb-ellipsis',
    'breadcrumb-item',
    'breadcrumb-link',
    'breadcrumb-list',
    'breadcrumb-page',
    'breadcrumb-separator',
  ],
  card: ['card-content', 'card-description', 'card-footer', 'card-header', 'card-title'],
  dialog: [
    'dialog-close',
    'dialog-content',
    'dialog-description',
    'dialog-footer',
    'dialog-header',
    'dialog-overlay',
    'dialog-title',
    'dialog-trigger',
  ],
  'dropdown-menu': [
    'dropdown-menu-checkbox-item',
    'dropdown-menu-content',
    'dropdown-menu-group',
    'dropdown-menu-item',
    'dropdown-menu-label',
    'dropdown-menu-radio-item',
    'dropdown-menu-separator',
    'dropdown-menu-shortcut',
    'dropdown-menu-sub',
    'dropdown-menu-sub-content',
    'dropdown-menu-sub-trigger',
    'dropdown-menu-trigger',
  ],
  navbar: ['navbar-actions', 'navbar-brand', 'navbar-content', 'navbar-item', 'navbar-nav'],
  notification: [
    'notification-actions',
    'notification-description',
    'notification-icon',
    'notification-title',
  ],
  'number-field': [
    'number-field-control',
    'number-field-decrement',
    'number-field-increment',
    'number-field-input',
  ],
  pagination: [
    'pagination-content',
    'pagination-ellipsis',
    'pagination-item',
    'pagination-link',
    'pagination-next',
    'pagination-previous',
  ],
  popover: ['popover-content', 'popover-trigger'],
  'radio-group': ['radio-group-item'],
  select: [
    'select-content',
    'select-group',
    'select-item',
    'select-label',
    'select-scroll-down-button',
    'select-scroll-up-button',
    'select-separator',
    'select-trigger',
    'select-value',
  ],
  sheet: [
    'sheet-content',
    'sheet-description',
    'sheet-footer',
    'sheet-header',
    'sheet-overlay',
    'sheet-title',
  ],
  table: [
    'table-body',
    'table-caption',
    'table-cell',
    'table-footer',
    'table-head',
    'table-header',
    'table-row',
  ],
} as const satisfies ComponentPartsMap

type PartsUnion = ComponentPartsMap[keyof ComponentPartsMap]

export type ComponentPartName = PartsUnion extends readonly (infer Part)[] ? Part : never
