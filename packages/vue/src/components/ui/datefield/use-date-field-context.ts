import { createContext } from '../../../hooks/create-context'

export type DateFieldContextValue = {
  inputType: 'date' | 'time' | 'datetime-local'
  granularity?: 'day' | 'minute' | 'second'
  hourCycle?: 12 | 24
  value?: string
  disabled?: boolean
  readOnly?: boolean
  min?: string
  max?: string
  onValueChange?: (value: string) => void
} | null

export const [DateFieldProvider, useDateFieldContext] = createContext<DateFieldContextValue>({
  id: 'DateFieldContext',
  providerName: '<DateField />',
  defaultValue: null,
})
