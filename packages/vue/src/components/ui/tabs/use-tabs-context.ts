import { inject, provide } from 'vue'

import type { useTabs } from './use-tabs'

export type UseTabsReturn = ReturnType<typeof useTabs>

export const TabsContextKey = Symbol('tabsContext')

export function provideTabsContext(context: UseTabsReturn) {
  provide(TabsContextKey, context)
}

export function useTabsContext() {
  const context = inject<UseTabsReturn>(TabsContextKey)
  if (!context) {
    throw new Error('useTabsContext must be used within a Tabs root component')
  }
  return context
}
