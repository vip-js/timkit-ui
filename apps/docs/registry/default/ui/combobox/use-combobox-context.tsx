import * as React from 'react'
import type { ComboboxApi } from '@timui/core'

export const ComboboxContext: React.Context<ComboboxApi | null> =
  React.createContext<ComboboxApi | null>(null)
export const ComboboxProvider: React.Provider<ComboboxApi | null> = ComboboxContext.Provider

export function useComboboxContext(): ComboboxApi {
  const context = React.useContext(ComboboxContext)
  if (!context) {
    throw new Error('useComboboxContext must be used within a Combobox')
  }
  return context
}
