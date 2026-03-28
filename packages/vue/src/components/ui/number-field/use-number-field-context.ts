import type { NumberFieldApi } from '@timui/core'
import type { ComputedRef } from 'vue'

import { createContext } from '../../../hooks/create-context'

export type NumberFieldContextValue = ComputedRef<NumberFieldApi>

export const [NumberFieldProvider, useNumberFieldContext] = createContext<NumberFieldContextValue>({
  id: 'NumberFieldContext',
  providerName: '<NumberField />',
})
