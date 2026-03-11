import type { DatePickerApi } from '@timui/core'
import type { ComputedRef } from 'vue'

import { createContext } from '../../../hooks/create-context'

export type DateRangePickerContextValue = ComputedRef<DatePickerApi> | null

export const [DateRangePickerProvider, useDateRangePickerContext] =
  createContext<DateRangePickerContextValue>({
    id: 'DateRangePickerContext',
    providerName: '<DateRangePicker />',
    defaultValue: null,
  })
