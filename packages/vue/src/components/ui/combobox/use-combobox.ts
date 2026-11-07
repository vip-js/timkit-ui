import type { ComboboxVueProps as CoreComboboxProps } from '@timui/core'
import { comboboxCollection, comboboxConnect, comboboxMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watchEffect } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

type ComboboxItem = {
  value: string
  label?: string
  disabled?: boolean
  [key: string]: string | number | boolean | null | undefined | object
}

export type ComboboxProps = CoreComboboxProps & {
  class?: string
  items?: ComboboxItem[]
}

const matchingItems = (items: ComboboxProps['items'], query: string) => {
  const source = items ?? []
  const needle = query.trim().toLowerCase()
  if (!needle) return source
  return source.filter((item) => String(item.label ?? item.value ?? '').toLowerCase().includes(needle))
}

export function useCombobox(props: ComboboxProps) {
  const generatedId = useId()
  const passed = usePassedProp()
  const query = ref(props.inputValue ?? '')

  const apiRef: { current: { setInputValue?: (value: string) => void } | null } = { current: null }
  const machineProps = computed(() => {
    const {
      class: _class,
      items,
      collection,
      id,
      loop: _loop,
      open: _open,
      value,
      defaultValue,
      defaultOpen,
      inputValue,
      onValueChange,
      onInputValueChange,
      onOpenChange,
      ...rest
    } = props
    const loop = passed<boolean>(props, 'loop')
    const open = passed<boolean | null>(props, 'open')
    const valueControlled = value !== undefined
    return {
      ...rest,
      ...(valueControlled ? { value: value == null ? [] : value } : { defaultValue }),
      ...(open === undefined ? { defaultOpen } : { open: open === true }),
      ...(loop === undefined ? {} : { loopFocus: loop }),
      id: id ?? generatedId,
      ...(inputValue === undefined ? {} : { inputValue }),
      collection: collection ?? comboboxCollection({ items: matchingItems(items, inputValue ?? query.value) }),
      onValueChange(details: { value: string[] }) {
        onValueChange?.(details.value)
        if (value !== undefined && (value == null || value.length === 0)) {
          queueMicrotask(() => apiRef.current?.setInputValue?.(''))
        }
      },
      onInputValueChange(details: { inputValue: string }) {
        if (inputValue === undefined) query.value = details.inputValue
        onInputValueChange?.(details.inputValue)
      },
      onOpenChange(details: { open: boolean }) {
        onOpenChange?.(details.open)
      },
    }
  })

  const service = useMachine(comboboxMachine, machineProps)
  const phase = ref('')
  watchEffect(() => {
    const open = service.state.matches('interacting')
    const highlighted = service.context.get('highlightedValue') ?? ''
    const value = service.context.get('value')
    const picked = Array.isArray(value) ? value.join(',') : ''
    phase.value = `${open}:${highlighted}:${picked}`
  })
  const api = computed(() => {
    phase.value
    const connected = comboboxConnect(service, normalizeProps)
    apiRef.current = connected
    return connected
  })

  return api
}
