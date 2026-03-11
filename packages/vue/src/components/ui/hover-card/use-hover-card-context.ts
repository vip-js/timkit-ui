import { createContext } from '../../../hooks/create-context'
import type { useHoverCard } from './use-hover-card'

export type UseHoverCardReturn = ReturnType<typeof useHoverCard>

export const [HoverCardProvider, useHoverCardContext] = createContext<UseHoverCardReturn>({
  id: 'hoverCardContext',
  providerName: '<HoverCard />',
})
