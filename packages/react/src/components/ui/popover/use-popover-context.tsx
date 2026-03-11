import * as React from 'react'

import type { usePopover } from './use-popover'

export type UsePopoverReturn = ReturnType<typeof usePopover>

const PopoverContext = React.createContext<UsePopoverReturn | null>(null)

export function PopoverProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: UsePopoverReturn
}) {
  return <PopoverContext.Provider value={value}> {children} </PopoverContext.Provider>
}

export function usePopoverContext() {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error('usePopoverContext must be used within a PopoverProvider')
  }
  return context
}
