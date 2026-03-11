import { createContext } from '../../../hooks/create-context'
import type { usePopover } from './use-popover'

export type UsePopoverReturn = ReturnType<typeof usePopover>

export const [PopoverProvider, usePopoverContext] = createContext<UsePopoverReturn>({
  id: 'popoverContext',
  providerName: '<Popover />',
})
