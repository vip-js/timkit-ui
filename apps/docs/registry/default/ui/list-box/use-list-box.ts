import * as React from 'react'
import { listBoxCollection, listBoxConnect, listBoxMachine, type ListBoxApi } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export type ListBoxItemData = {
  label: string
  value: string
  disabled?: boolean
}

export type ListBoxSelectionMode = 'single' | 'multiple'

export type UseListBoxProps = {
  id?: string
  selectionMode?: ListBoxSelectionMode
  selectedKeys?: Iterable<React.Key>
  defaultSelectedKeys?: Iterable<React.Key>
  disabled?: boolean
  required?: boolean
  name?: string
  onSelectionChange?: (keys: Set<React.Key>) => void
}

type RegisteredItemsState = {
  order: string[]
  byValue: Record<string, ListBoxItemData>
}

const emptyItemsState: RegisteredItemsState = { order: [], byValue: {} }

const toValueArray = (keys?: Iterable<React.Key>) => {
  if (!keys) return undefined
  return Array.from(keys, (key) => String(key))
}

const toSelectionSet = (value: string[]) => new Set<React.Key>(value)

export function useListBox(props: UseListBoxProps): {
  api: ListBoxApi
  registerItem: (item: ListBoxItemData) => void
  unregisterItem: (value: string) => void
} {
  const generatedId = React.useId()
  const listBoxId = props.id ?? generatedId
  const selectionMode = props.selectionMode ?? 'single'
  const [registeredItems, setRegisteredItems] =
    React.useState<RegisteredItemsState>(emptyItemsState)

  const registerItem = React.useCallback((item: ListBoxItemData) => {
    setRegisteredItems((prev) => {
      const prevItem = prev.byValue[item.value]
      const nextOrder = prev.order.includes(item.value) ? prev.order : [...prev.order, item.value]
      const nextByValue =
        prevItem && prevItem.label === item.label && prevItem.disabled === item.disabled
          ? prev.byValue
          : { ...prev.byValue, [item.value]: item }

      if (nextOrder === prev.order && nextByValue === prev.byValue) return prev
      return { order: nextOrder, byValue: nextByValue }
    })
  }, [])

  const unregisterItem = React.useCallback((value: string) => {
    setRegisteredItems((prev) => {
      if (!prev.byValue[value]) return prev
      const nextOrder = prev.order.filter((itemValue) => itemValue !== value)
      const nextByValue = { ...prev.byValue }
      delete nextByValue[value]
      return { order: nextOrder, byValue: nextByValue }
    })
  }, [])

  const items = React.useMemo(
    () =>
      registeredItems.order
        .map((value) => registeredItems.byValue[value])
        .filter((item): item is ListBoxItemData => Boolean(item)),
    [registeredItems]
  )

  const collection = React.useMemo(
    () =>
      listBoxCollection<ListBoxItemData>({
        items,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
      }),
    [items]
  )

  const controlledValue = toValueArray(props.selectedKeys)
  const defaultValue =
    props.selectedKeys === undefined ? toValueArray(props.defaultSelectedKeys) : undefined

  const service = useMachine(listBoxMachine, {
    id: listBoxId,
    collection,
    multiple: selectionMode === 'multiple',
    value: controlledValue,
    defaultValue,
    disabled: props.disabled,
    required: props.required,
    name: props.name,
    open: true,
    defaultOpen: true,
    closeOnSelect: false,
    onValueChange(details) {
      props.onSelectionChange?.(toSelectionSet(details.value))
    },
  })

  const api = React.useMemo(() => listBoxConnect(service, normalizeProps), [service])

  return {
    api,
    registerItem,
    unregisterItem,
  }
}
