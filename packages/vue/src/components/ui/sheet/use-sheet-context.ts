import type { DialogApi } from '@timui/core'
import { inject, provide, type ComputedRef } from 'vue'

export const SheetContextKey = Symbol('SheetContext')

export function provideSheetContext(api: ComputedRef<DialogApi>) {
  provide(SheetContextKey, api)
}

export function useSheetContext(): ComputedRef<DialogApi> {
  const context = inject<ComputedRef<DialogApi>>(SheetContextKey)
  if (!context) {
    throw new Error('useSheetContext must be used within a SheetProvider')
  }
  return context
}
