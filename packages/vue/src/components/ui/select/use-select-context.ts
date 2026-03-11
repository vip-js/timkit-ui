import type { SelectApi } from '@timui/core'
import { inject, provide, type ComputedRef } from 'vue'

export const SelectContextKey = Symbol('selectContext')

export function provideSelectContext(context: ComputedRef<SelectApi>) {
  provide(SelectContextKey, context)
}

export function useSelectContext(): ComputedRef<SelectApi> {
  const context = inject<ComputedRef<SelectApi>>(SelectContextKey)
  if (!context) {
    throw new Error('useSelectContext must be used within a Select component')
  }
  return context
}
