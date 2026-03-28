import * as React from 'react'

import type { SelectItemData } from './use-select'

export type SelectApiLike = {
  open?: boolean
  value?: string[]
  valueAsString?: string
  getTriggerProps?: () => React.HTMLAttributes<HTMLElement>
  getPositionerProps?: () => React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties }
  getContentProps?: () => React.HTMLAttributes<HTMLElement>
  getItemProps?: (options: { item: SelectItemData }) => React.HTMLAttributes<HTMLElement>
  registerItem?: (item: SelectItemData) => void
  unregisterItem?: (value: string) => void
  getItemLabel?: (value: string) => string | undefined
}

export const SelectContext = React.createContext<SelectApiLike | null>(null)
export const SelectProvider = SelectContext.Provider

export function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('useSelectContext must be used within a Select component')
  }
  return context
}
