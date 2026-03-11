import type { Ref } from 'vue'

import { createContext } from '../../../hooks/create-context'

export type ListBoxSelectionMode = 'single' | 'multiple'

export type ListBoxContextValue = {
  selectionMode: Ref<ListBoxSelectionMode>
  selectedIds: Ref<Set<string>>
  activeId: Ref<string | null>
  registerItem: (id: string, el: HTMLElement | null, disabled: boolean) => void
  unregisterItem: (id: string) => void
  setItemDisabled: (id: string, disabled: boolean) => void
  setActive: (id: string) => void
  isSelected: (id: string) => boolean
  isDisabled: (id: string) => boolean
  selectItem: (id: string) => void
  focusItem: (id: string) => void
}

export const [ListBoxProvider, useListBoxContext] = createContext<ListBoxContextValue>({
  id: 'ListBoxContext',
  providerName: '<ListBox />',
})
