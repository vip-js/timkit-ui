import type { MenuApi } from '@timui/core'
import { inject, provide, type ComputedRef } from 'vue'

import { createContext } from '../../../hooks/create-context'

const context = createContext<ComputedRef<MenuApi>>({
  id: 'dropdownMenuContext',
  providerName: '<DropdownMenu />',
})

export const DropdownMenuProvider: (value: ComputedRef<MenuApi>) => void = context[0]
export const useDropdownMenuContext: (fallback?: ComputedRef<MenuApi>) => ComputedRef<MenuApi> =
  context[1]

export type DropdownMenuRadioGroupContextValue = {
  value?: string
  onValueChange?: (value: string) => void
}

export const DropdownMenuRadioGroupContextKey = Symbol('DropdownMenuRadioGroupContext')

export function provideDropdownMenuRadioGroupContext(
  value: ComputedRef<DropdownMenuRadioGroupContextValue>
) {
  provide(DropdownMenuRadioGroupContextKey, value)
}

export function useDropdownMenuRadioGroupContext() {
  return inject<ComputedRef<DropdownMenuRadioGroupContextValue> | undefined>(
    DropdownMenuRadioGroupContextKey,
    undefined
  )
}
