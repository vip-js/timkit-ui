import * as React from 'react'
import {
  comboboxCollection,
  comboboxConnect,
  comboboxMachine,
  createTimEvent,
  type ComboboxApi,
} from '@timui/core'
import type { ComboboxProps as CoreComboboxProps } from '@timui/core'
import type { CollectionItem } from '@zag-js/collection'
import { normalizeProps, useMachine } from '@zag-js/react'

export type ComboboxProps = CoreComboboxProps & {
  className?: string
  children?: React.ReactNode
  items?: CollectionItem[]
}

const matchingItems = (items: ComboboxProps['items'], query: string) => {
  const source = items ?? []
  const needle = query.trim().toLowerCase()
  if (!needle) return source
  return source.filter((item) => {
    const record = item as { label?: string; value?: string }
    return String(record.label ?? record.value ?? '').toLowerCase().includes(needle)
  })
}

export function useCombobox(props: ComboboxProps): ComboboxApi {
  const {
    className,
    children,
    items,
    collection,
    loop,
    value,
    defaultValue,
    open,
    defaultOpen,
    inputValue,
    onInputValueChange,
    ...machineProps
  } = props
  const [query, setQuery] = React.useState(inputValue ?? '')
  const resolvedCollection =
    collection ?? comboboxCollection({ items: matchingItems(items, inputValue ?? query) })
  const generatedId = React.useId()
  const comboboxId = props.id ?? generatedId
  const valueControlled = value !== undefined
  const openControlled = open !== undefined
  const apiRef = React.useRef<ComboboxApi | null>(null)
  const service = useMachine(comboboxMachine, {
    ...machineProps,
    id: comboboxId,
    collection: resolvedCollection,
    ...(valueControlled ? { value: value == null ? [] : value } : { defaultValue }),
    ...(openControlled ? { open: open === true } : { defaultOpen }),
    ...(loop === undefined ? {} : { loopFocus: loop }),
    ...(inputValue === undefined ? {} : { inputValue }),
    onInputValueChange(details) {
      if (inputValue === undefined) setQuery(details.inputValue)
      onInputValueChange?.(details)
    },
    onValueChange(details) {
      const nextValue = Array.isArray(details.value)
        ? details.value
        : details.value
          ? [details.value]
          : []
      props.onValueChange?.(createTimEvent('change', comboboxId, { value: nextValue }))
      if (value !== undefined && (value == null || value.length === 0)) {
        queueMicrotask(() => apiRef.current?.setInputValue(''))
      }
    },
  })

  const api = Array.isArray(service)
    ? (
        comboboxConnect as never as (
          state: never,
          send: never,
          props: typeof normalizeProps
        ) => ComboboxApi
      )(service[0] as never, service[1] as never, normalizeProps)
    : comboboxConnect(service as never, normalizeProps)
  apiRef.current = api
  return api
}
