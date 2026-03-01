import * as React from 'react'
import { accordionMachine, createTimEvent, accordionConnect } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

type AccordionChangeEvent = {
    type: string
    target: { id: string }
    detail: { value: string | string[] }
    timestamp: number
}

export interface UseAccordionProps {
    id?: string
    value?: string | string[]
    defaultValue?: string | string[]
    type?: 'single' | 'multiple'
    collapsible?: boolean
    disabled?: boolean
    onValueChange?: (details: AccordionChangeEvent) => void
}

const toArray = (value?: string | string[] | null, multiple?: boolean) => {
    if (value == null) return undefined
    if (Array.isArray(value)) return value
    return value === '' ? [] : [value]
}

const toValue = (value: string[], multiple: boolean) => {
    if (multiple) return value
    return value[0] ?? ''
}

export function useAccordion(props: UseAccordionProps = {}) {
    const generatedId = React.useId()
    const accordionId = props.id ?? generatedId
    const multiple = props.type === 'multiple'
    const value = toArray(props.value, multiple)
    const defaultValueArray = toArray(props.defaultValue, multiple)

    const service = useMachine(accordionMachine, {
        id: accordionId,
        multiple,
        collapsible: props.collapsible,
        disabled: props.disabled,
        value,
        defaultValue: value === undefined ? defaultValueArray : undefined,
        onValueChange: (details) => {
            props.onValueChange?.(
                createTimEvent('change', accordionId, {
                    value: toValue(details.value, multiple),
                })
            )
        },
    })

    const api = React.useMemo(() => accordionConnect(service, normalizeProps), [service])

    return { api, multiple }
}
