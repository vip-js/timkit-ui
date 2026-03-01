import * as React from 'react'
import type { dialogConnect } from '@timui/core'

export type DialogContextValue = ReturnType<typeof dialogConnect>

const DialogContext = React.createContext<DialogContextValue | null>(null)

export const DialogProvider: React.Provider<DialogContextValue | null> = DialogContext.Provider

export function useDialogContext(): DialogContextValue {
    const context = React.useContext(DialogContext)
    if (!context) {
        throw new Error('Dialog components must be used within `<DialogProvider />`')
    }
    return context
}
