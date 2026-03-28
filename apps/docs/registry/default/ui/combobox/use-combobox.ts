import * as React from 'react'
import {
  comboboxCollection,
  comboboxConnect,
  comboboxMachine,
  createTimEvent,
  type ComboboxApi,
} from '@timui/core'
import type { ComboboxProps as CoreComboboxProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

type CollectionItem = {
  value: string
  label?: string
  [key: string]: unknown
}

export type ComboboxProps = CoreComboboxProps & {
  className?: string
  children?: React.ReactNode
  items?: CollectionItem[]
}

export function useCombobox(props: ComboboxProps): ComboboxApi {
  const { className, children, items, collection, ...machineProps } = props
  const resolvedCollection = collection ?? comboboxCollection({ items: items ?? [] })
  const generatedId = React.useId()
  const comboboxId = props.id ?? generatedId
  const service = useMachine(comboboxMachine, {
    ...machineProps,
    id: comboboxId,
    collection: resolvedCollection,
    onValueChange(details) {
      const nextValue = Array.isArray(details.value)
        ? details.value
        : details.value
          ? [details.value]
          : []
      props.onValueChange?.(createTimEvent('change', comboboxId, { value: nextValue }))
    },
  })

  return Array.isArray(service)
    ? (
        comboboxConnect as never as (
          state: never,
          send: never,
          props: typeof normalizeProps
        ) => ComboboxApi
      )(service[0] as never, service[1] as never, normalizeProps)
    : comboboxConnect(service as never, normalizeProps)
}
