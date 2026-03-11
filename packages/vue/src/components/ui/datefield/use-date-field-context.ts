import { createContext } from '../../../hooks/create-context'

export type DateFieldContextValue = {
  inputType: 'date' | 'time'
} | null

export const [DateFieldProvider, useDateFieldContext] = createContext<DateFieldContextValue>({
  id: 'DateFieldContext',
  providerName: '<DateField />',
  defaultValue: null,
})
