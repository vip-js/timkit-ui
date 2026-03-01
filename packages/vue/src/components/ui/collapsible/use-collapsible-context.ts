import { type ComputedRef, inject, provide } from 'vue'
import type { CollapsibleApi } from '@timui/core'

export const CollapsibleContextKey = Symbol('CollapsibleContext')

export function provideCollapsibleContext(api: ComputedRef<CollapsibleApi>) {
    provide(CollapsibleContextKey, api)
}

export function useCollapsibleContext(): ComputedRef<CollapsibleApi> {
    const context = inject<ComputedRef<CollapsibleApi>>(CollapsibleContextKey)
    if (!context) {
        throw new Error('useCollapsibleContext must be used within a CollapsibleProvider')
    }
    return context
}
