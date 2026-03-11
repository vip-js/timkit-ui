import type { ToggleGroupApi, ToggleVariants } from '@timui/core'
import { inject, provide, type ComputedRef } from 'vue'

export type ToggleGroupContextValue = {
  variant?: ToggleVariants['variant']
  size?: ToggleVariants['size']
  api: ComputedRef<ToggleGroupApi>
  type?: 'single' | 'multiple'
  disabled?: boolean
}

export const ToggleGroupContextKey = Symbol('ToggleGroupContext')

export function provideToggleGroupContext(context: ToggleGroupContextValue) {
  provide(ToggleGroupContextKey, context)
}

export function useToggleGroupContext() {
  const context = inject<ToggleGroupContextValue>(ToggleGroupContextKey)
  if (!context) {
    throw new Error('useToggleGroupContext must be used within a ToggleGroupProvider')
  }
  return context
}
