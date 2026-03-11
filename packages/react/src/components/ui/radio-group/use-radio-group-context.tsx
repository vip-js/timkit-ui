import * as React from 'react'

import type { useRadioGroup } from './use-radio-group'

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>

const RadioGroupContext = React.createContext<UseRadioGroupReturn | null>(null)

export function RadioGroupProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: UseRadioGroupReturn
}) {
  return <RadioGroupContext.Provider value={value}>{children}</RadioGroupContext.Provider>
}

export function useRadioGroupContext() {
  const context = React.useContext(RadioGroupContext)
  if (!context) {
    throw new Error('useRadioGroupContext must be used within a RadioGroupProvider')
  }
  return context
}
