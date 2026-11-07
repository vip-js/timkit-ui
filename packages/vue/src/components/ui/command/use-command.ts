import { comboboxCollection, comboboxConnect, comboboxMachine } from '@timui/core'
import { usePassedProp } from '../../../hooks/passed-prop'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watch, watchEffect } from 'vue'
import type { HTMLAttributes } from 'vue'

export type CommandItem = { value: string; label: string; disabled?: boolean }

export const commandMatches = (item: CommandItem, query: string) => {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return `${item.label} ${item.value}`.toLowerCase().includes(needle)
}

export interface UseCommandProps {
  class?: HTMLAttributes['class']
  value?: string
  modelValue?: string
  defaultValue?: string
  disabled?: boolean
  id?: string
  onValueChange?: (value?: string) => void
}

export interface UseCommandEmits {
  (e: 'update:value', value?: string): void
  (e: 'update:modelValue', value?: string): void
  (e: 'change', value?: string): void
}

export function useCommand(props: UseCommandProps, emit: UseCommandEmits) {
  const generatedId = useId()
  const passed = usePassedProp()
  const options = ref<CommandItem[]>([])
  const registerItem = (item: CommandItem) => {
    const index = options.value.findIndex((opt) => opt.value === item.value)
    if (index >= 0) {
      options.value[index] = item
      return
    }
    options.value.push(item)
  }
  const unregisterItem = (value: string) => {
    const index = options.value.findIndex((opt) => opt.value === value)
    if (index >= 0) options.value.splice(index, 1)
  }

  const disabled = computed(() => passed<boolean>(props, 'disabled') === true)
  const query = ref('')
  const currentOf = () => {
    const value = passed<string | null>(props, 'value')
    if (value !== undefined) return value
    return passed<string | null>(props, 'modelValue')
  }
  const initialValue = currentOf()
  const selected = ref(initialValue !== undefined ? (initialValue ?? '') : (props.defaultValue ?? ''))

  const machineProps = computed(() => {
    const collection = comboboxCollection({
      items: options.value.filter((item) => commandMatches(item, query.value)),
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
      isItemDisabled: (item) => item.disabled === true,
    })
    const current = currentOf()
    return {
      id: props.id ?? generatedId,
      collection,
      ...(current !== undefined ? { value: current ? [current] : [] } : {}),
      ...(current === undefined && props.defaultValue ? { defaultValue: [props.defaultValue] } : {}),
      ...(disabled.value ? { disabled: true } : {}),
      onValueChange(details: { value: string[] }) {
        const nextValue = details.value?.[0] ?? ''
        if (currentOf() === undefined) selected.value = nextValue
        props.onValueChange?.(nextValue)
        emit('update:value', nextValue)
        emit('update:modelValue', nextValue)
        emit('change', nextValue)
      },
      inputBehavior: 'autohighlight' as const,
      open: true,
      onInputValueChange(details: { inputValue: string }) {
        if (disabled.value) return
        query.value = details.inputValue
      },
    }
  })

  const service = useMachine(comboboxMachine, machineProps)
  const phase = ref('')
  watchEffect(() => {
    const value = service.context.get('value')
    phase.value = Array.isArray(value) ? value.join('|') : ''
  })
  const api = computed(() => {
    phase.value
    options.value
    return comboboxConnect(service, normalizeProps)
  })

  watch(currentOf, (val) => {
    if (val === undefined) return
    const next = val ?? ''
    selected.value = next
    if ((api.value?.value?.[0] ?? '') !== next) api.value?.setValue(next ? [next] : [])
  })

  const choose = (value: string) => {
    if (disabled.value) return
    const item = options.value.find((entry) => entry.value === value)
    if (!item || item.disabled) return
    if (currentOf() !== undefined) {
      props.onValueChange?.(value)
      emit('update:value', value)
      emit('update:modelValue', value)
      emit('change', value)
      return
    }
    selected.value = value
    api.value?.selectValue?.(value)
    api.value?.setValue?.([value])
  }

  return {
    api,
    disabled,
    query,
    options,
    selected,
    choose,
    registerItem,
    unregisterItem,
  }
}
