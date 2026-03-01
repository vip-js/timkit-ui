import * as React from 'react'
import { selectCollection, selectConnect, selectMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export type SelectItemData = {
    label: React.ReactNode
    value: string
}

export type SelectProps = {
    id?: string
    collection?: ReturnType<typeof selectCollection<SelectItemData>>
    children?: React.ReactNode
}

export function useSelect({ id, collection }: SelectProps) {
    const generatedId = React.useId()
    const service = useMachine(selectMachine, {
        id: id ?? generatedId,
        collection: collection ?? selectCollection<SelectItemData>({ items: [] }),
    })

    return selectConnect(service, normalizeProps)
}
