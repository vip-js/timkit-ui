import type { ComponentSchema } from '../core/schemas'

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
