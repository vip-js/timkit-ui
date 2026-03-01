import { type ComputedRef, inject, provide } from 'vue'
import type { DialogApi } from '@timui/core'

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
