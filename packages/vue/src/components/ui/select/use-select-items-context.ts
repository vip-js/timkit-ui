import type { SelectItem } from '@timui/core'
import { inject, provide, type Ref } from 'vue'

type SelectItemsContext = {
  registerItem: (item: SelectItem) => void
  unregisterItem: (value: string) => void
  itemLabels: Ref<Record<string, string>>
}

const SelectItemsContextKey = Symbol('selectItemsContext')

export function provideSelectItemsContext(context: SelectItemsContext) {
  provide(SelectItemsContextKey, context)
}

export function useSelectItemsContext(): SelectItemsContext {
  const context = inject<SelectItemsContext>(SelectItemsContextKey)
  if (!context) {
    throw new Error('useSelectItemsContext must be used within a Select component')
  }
  return context
}
