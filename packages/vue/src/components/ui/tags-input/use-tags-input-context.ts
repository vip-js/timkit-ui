import { type ComputedRef, inject, provide } from 'vue'
import type { TagsInputApi } from '@timui/core'

export const TagsInputContextKey = Symbol('TagsInputContext')

export function provideTagsInputContext(api: ComputedRef<TagsInputApi>) {
    provide(TagsInputContextKey, api)
}

export function useTagsInputContext(): ComputedRef<TagsInputApi> {
    const context = inject<ComputedRef<TagsInputApi>>(TagsInputContextKey)
    if (!context) {
        throw new Error('useTagsInputContext must be used within a TagsInputProvider')
    }
    return context
}
