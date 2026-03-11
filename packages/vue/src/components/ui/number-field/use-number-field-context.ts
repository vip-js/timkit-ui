import type { Api as NumberInputApi } from '@zag-js/number-input'
import type { ComputedRef } from 'vue'

import { createContext } from '../../../hooks/create-context'

export type NumberFieldContextValue = ComputedRef<NumberInputApi>

export const [NumberFieldProvider, useNumberFieldContext] = createContext<NumberFieldContextValue>({
  id: 'NumberFieldContext',
  providerName: '<NumberField />',
})
