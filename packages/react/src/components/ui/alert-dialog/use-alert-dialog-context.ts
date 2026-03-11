import * as React from 'react'
import type { dialogConnect } from '@timui/core'

export type AlertDialogContextValue = ReturnType<typeof dialogConnect>

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null)

export const AlertDialogProvider: React.Provider<AlertDialogContextValue | null> =
  AlertDialogContext.Provider

export function useAlertDialogContext(): AlertDialogContextValue {
  const context = React.useContext(AlertDialogContext)
  if (!context) {
    throw new Error('AlertDialog components must be used within `<AlertDialogProvider />`')
  }
  return context
}
