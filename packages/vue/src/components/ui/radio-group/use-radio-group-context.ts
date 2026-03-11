import { inject, provide } from 'vue'

import type { useRadioGroup } from './use-radio-group'

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>

export const RadioGroupContextKey = Symbol('radioGroupContext')

export function provideRadioGroupContext(context: UseRadioGroupReturn) {
  provide(RadioGroupContextKey, context)
}

export function useRadioGroupContext() {
  const context = inject<UseRadioGroupReturn>(RadioGroupContextKey)
  if (!context) {
    throw new Error('useRadioGroupContext must be used within a RadioGroup component')
  }
  return context
}
