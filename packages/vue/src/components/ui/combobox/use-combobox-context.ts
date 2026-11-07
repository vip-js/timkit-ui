import type { ComboboxApi } from '@timui/core'
import { inject, provide, type ComputedRef, type Ref } from 'vue'

export const ComboboxContextKey = Symbol('comboboxContext')
export const ComboboxLabelPresenceKey = Symbol('comboboxLabelPresence')

export function provideComboboxLabelPresence(labelled: Ref<boolean>) {
  provide(ComboboxLabelPresenceKey, labelled)
}

export function useComboboxLabelPresence() {
  return inject<Ref<boolean> | null>(ComboboxLabelPresenceKey, null)
}

export function provideComboboxContext(context: ComputedRef<ComboboxApi>) {
  provide(ComboboxContextKey, context)
}

export function useComboboxContext(): ComputedRef<ComboboxApi> {
  const context = inject<ComputedRef<ComboboxApi>>(ComboboxContextKey)
  if (!context) {
    throw new Error('useComboboxContext must be used within a Combobox component')
  }
  return context
}
