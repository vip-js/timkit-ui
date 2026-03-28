import * as React from 'react'
import type { ListBoxApi } from '@timui/core'

import type { ListBoxItemData } from './use-list-box'

type ListBoxContextValue = {
  api: ListBoxApi
  registerItem: (item: ListBoxItemData) => void
  unregisterItem: (value: string) => void
}

const ListBoxContext = React.createContext<ListBoxContextValue | null>(null)

export function ListBoxProvider({
  value,
  children,
}: {
  value: ListBoxContextValue
  children: React.ReactNode
}) {
  return <ListBoxContext.Provider value={value}>{children}</ListBoxContext.Provider>
}

export function useListBoxContext() {
  const context = React.useContext(ListBoxContext)
  if (!context) {
    throw new Error('useListBoxContext must be used within a ListBox component')
  }
  return context
}
