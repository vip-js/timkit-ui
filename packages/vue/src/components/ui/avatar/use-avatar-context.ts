import { type ComputedRef, inject, provide } from 'vue'
import type { AvatarApi } from '@timui/core'

export const AvatarContextKey = Symbol('AvatarContext')

export function provideAvatarContext(api: ComputedRef<AvatarApi>) {
    provide(AvatarContextKey, api)
}

export function useAvatarContext(): ComputedRef<AvatarApi> {
    const context = inject<ComputedRef<AvatarApi>>(AvatarContextKey)
    if (!context) {
        throw new Error('useAvatarContext must be used within an AvatarProvider')
    }
    return context
}
