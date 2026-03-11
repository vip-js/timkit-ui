import * as React from 'react'

import type { useTabs } from './use-tabs'

export type UseTabsReturn = ReturnType<typeof useTabs>

const TabsContext = React.createContext<UseTabsReturn | null>(null)

export function TabsProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: UseTabsReturn
}) {
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}

export function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider')
  }
  return context
}
