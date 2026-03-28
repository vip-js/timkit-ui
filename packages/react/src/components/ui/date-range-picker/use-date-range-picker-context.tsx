import * as React from 'react'
import type { DatePickerApi } from '@timui/core'

export type DateRangePickerApiLike = DatePickerApi

export const DateRangePickerContext: React.Context<DateRangePickerApiLike | null> =
  React.createContext<DateRangePickerApiLike | null>(null)
export const DateRangePickerProvider: React.Provider<DateRangePickerApiLike | null> =
  DateRangePickerContext.Provider

export function useDateRangePickerContext(): DateRangePickerApiLike {
  const context = React.useContext(DateRangePickerContext)
  if (!context) {
    throw new Error('DateRangePicker components must be used within `<DateRangePicker />`')
  }
  return context
}
