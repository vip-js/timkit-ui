import * as React from 'react'

import type { useTabs } from './use-tabs'

export type UseTabsReturn = ReturnType<typeof useTabs>

const TabsContext = React.createContext<UseTabsReturn | null>(null)
const TabsDisabledContext = React.createContext(false)

export function TabsDisabledProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: boolean
}) {
  return <TabsDisabledContext.Provider value={value}>{children}</TabsDisabledContext.Provider>
}

export function useTabsDisabled() {
  return React.useContext(TabsDisabledContext)
}

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
