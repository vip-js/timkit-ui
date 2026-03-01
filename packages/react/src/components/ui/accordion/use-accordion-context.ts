import * as React from 'react'
import type { accordionConnect } from '@timui/core'

export interface AccordionContextValue {
    api: ReturnType<typeof accordionConnect>
    multiple: boolean
}

export const AccordionContext = React.createContext<AccordionContextValue | null>(null)

export function useAccordionContext() {
    const context = React.useContext(AccordionContext)
    if (!context) {
        throw new Error('Accordion components must be used within an Accordion Provider')
    }
    return context
}

export const AccordionProvider = AccordionContext.Provider

export interface AccordionItemContextValue {
    value: string
    disabled?: boolean
    isOpen: boolean
}

export const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null)

export function useAccordionItemContext() {
    const context = React.useContext(AccordionItemContext)
    if (!context) {
        throw new Error('Accordion child components must be used within an AccordionItem')
    }
    return context
}

export const AccordionItemProvider = AccordionItemContext.Provider
