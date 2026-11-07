import type { ListBoxApi, ListBoxItem } from '@timui/core'
import type { ComputedRef, Ref } from 'vue'

import { createContext } from '../../../hooks/create-context'

export type ListBoxContextValue = {
  api: ComputedRef<ListBoxApi>
  highlightedValue: Ref<string>
  registerItem: (item: ListBoxItem) => void
  unregisterItem: (value: string) => void
}

export const [ListBoxProvider, useListBoxContext] = createContext<ListBoxContextValue>({
  id: 'ListBoxContext',
  providerName: '<ListBox />',
})
