import type { AccordionApi } from '@timui/core'
import type { ComputedRef } from 'vue'

import { createContext } from '../../../hooks/create-context'

export type UseAccordionContext = ComputedRef<AccordionApi>

export const [AccordionProvider, useAccordionContext] = createContext<UseAccordionContext>({
  id: 'AccordionContext',
  providerName: '<Accordion />',
})

export type UseAccordionItemContext = ComputedRef<{
  value: string
  disabled?: boolean
  isOpen: boolean
}>

export const [AccordionItemProvider, useAccordionItemContext] =
  createContext<UseAccordionItemContext>({
    id: 'AccordionItemContext',
    providerName: '<AccordionItem />',
  })
