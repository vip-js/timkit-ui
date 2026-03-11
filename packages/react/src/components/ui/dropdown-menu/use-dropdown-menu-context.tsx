import * as React from 'react'
import type { menuConnect } from '@timui/core'

export type DropdownMenuApi = ReturnType<typeof menuConnect>

export const DropdownMenuContext: React.Context<DropdownMenuApi | null> =
  React.createContext<DropdownMenuApi | null>(null)
export const DropdownMenuRadioGroupContext: React.Context<{
  value?: string
  onValueChange?: (value: string) => void
} | null> = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
} | null>(null)

export const DropdownMenuProvider: React.Provider<DropdownMenuApi | null> =
  DropdownMenuContext.Provider
export const DropdownMenuRadioGroupProvider: React.Provider<{
  value?: string
  onValueChange?: (value: string) => void
} | null> = DropdownMenuRadioGroupContext.Provider

export function useDropdownMenuContext(): DropdownMenuApi {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('useDropdownMenuContext must be used within a DropdownMenu component')
  }
  return context
}

export function useDropdownMenuRadioGroupContext() {
  const context = React.useContext(DropdownMenuRadioGroupContext)
  if (!context) {
    throw new Error(
      'useDropdownMenuRadioGroupContext must be used within a DropdownMenuRadioGroup component'
    )
  }
  return context
}
