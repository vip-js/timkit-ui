import type { DialogApi, SheetProps } from '@timui/core'
import { inject, provide, type ComputedRef, type InjectionKey } from 'vue'

export const SheetContextKey = Symbol('SheetContext')
export const SheetSideKey: InjectionKey<ComputedRef<SheetProps['side']>> = Symbol('SheetSide')

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
