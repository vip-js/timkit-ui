import * as React from 'react'
import type { dialogConnect } from '@timui/core'

export type SheetContextValue = ReturnType<typeof dialogConnect>

const SheetContext = React.createContext<SheetContextValue | null>(null)

export const SheetProvider: React.Provider<SheetContextValue | null> = SheetContext.Provider

export function useSheetContext(): SheetContextValue {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error('Sheet components must be used within `<SheetProvider />`')
  }
  return context
}
