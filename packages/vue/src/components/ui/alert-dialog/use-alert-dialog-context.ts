import type { dialogConnect } from '@timui/core'
import { inject, provide, type ComputedRef } from 'vue'

export type AlertDialogContext = ComputedRef<ReturnType<typeof dialogConnect>>

export const AlertDialogContextKey = Symbol('AlertDialogContext')

export const provideAlertDialogContext = (context: AlertDialogContext) => {
  provide(AlertDialogContextKey, context)
}

export const useAlertDialogContext = (): AlertDialogContext => {
  const context = inject(AlertDialogContextKey)
  if (!context) {
    throw new Error('AlertDialog components must be used within a `<AlertDialog />` provider.')
  }
  return context as AlertDialogContext
}
