import type * as accordion from '@zag-js/accordion'
import type { ComputedRef } from 'vue'

import { createContext } from '../../lib/create-context'

export const [AccordionProvider, useAccordionContext] = createContext<
  ComputedRef<{ api: accordion.Api }>
>({
  id: 'AccordionContext',
  providerName: '<Accordion />',
})

export const [AccordionItemProvider, useAccordionItemContext] = createContext<
  ComputedRef<{
    value: string
    disabled: boolean
    isOpen: boolean
  }>
>({
  id: 'AccordionItemContext',
  providerName: '<AccordionItem />',
})
