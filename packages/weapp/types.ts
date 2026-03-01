import type { ComponentSchema } from '../core/src/shared/schema'

export interface WeappPrimitive {
  name: string
  schema: ComponentSchema
  description: string
  files: {
    wxml: string
    wxss: string
    logic?: string
  }
  tokens?: string[]
}
