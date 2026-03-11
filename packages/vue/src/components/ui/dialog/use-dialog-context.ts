import type { dialogConnect } from '@timui/core'
import type { ComputedRef } from 'vue'

import { createContext } from '../../../hooks/create-context'

export type DialogContext = ComputedRef<ReturnType<typeof dialogConnect>>

export const [DialogProvider, useDialogContext] = createContext<DialogContext>({
  id: 'DialogContext',
  providerName: '<Dialog />',
})
