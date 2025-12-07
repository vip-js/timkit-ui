export type ComponentPlatform = 'web' | 'wechat'

export interface ComponentProp {
  name: string
  type: 'string' | 'number' | 'boolean' | 'enum' | 'event'
  required?: boolean
  description: string
  values?: string[]
  defaultValue?: string | number | boolean
}

export interface ComponentSlot {
  name: string
  description: string
  required?: boolean
}

export interface ComponentVariantOption {
  name: string
  description: string
  tokens?: string[]
}

export interface ComponentVariant {
  name: string
  prop: string
  description: string
  options: ComponentVariantOption[]
  defaultOption?: string
}

export interface ComponentInteraction {
  name: string
  description: string
  states: string[]
}

export interface ComponentSchema {
  name: string
  title: string
  description: string
  props: ComponentProp[]
  slots: ComponentSlot[]
  variants?: ComponentVariant[]
  tokens?: string[]
  interactions?: ComponentInteraction[]
  supportedPlatforms: ComponentPlatform[]
}

export { default as buttonSchema } from './button'
export { default as badgeSchema } from './badge'
export { default as toggleSchema } from './toggle'
export { default as toastSchema } from './toast'
export { default as navigationMenuSchema } from './navigation-menu'
