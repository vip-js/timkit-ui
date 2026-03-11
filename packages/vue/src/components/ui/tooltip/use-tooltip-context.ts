import { createContext } from '../../../hooks/create-context'
import type { useTooltip } from './use-tooltip'

export type UseTooltipReturn = ReturnType<typeof useTooltip>

export const [TooltipProvider, useTooltipContext] = createContext<UseTooltipReturn>({
  id: 'tooltipContext',
  providerName: '<Tooltip />',
})
