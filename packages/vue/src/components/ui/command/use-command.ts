import { comboboxCollection, comboboxConnect, comboboxMachine } from '@timui/core'
import type { ComboboxVueProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'

export type CommandItem = { value: string; label: string }

export interface UseCommandProps {
  class?: HTMLAttributes['class']
  value?: string
  modelValue?: string
  defaultValue?: string
  id?: string
}

export interface UseCommandEmits {
  (e: 'update:value', value?: string): void
  (e: 'update:modelValue', value?: string): void
  (e: 'change', value?: string): void
}

type ComboboxValueChangeDetails = Parameters<NonNullable<ComboboxVueProps['onValueChange']>>[0]

export function useCommand(props: UseCommandProps, emit: UseCommandEmits) {
  const options = ref<CommandItem[]>([])
  const registerItem = (item: CommandItem) => {
    if (options.value.find((opt) => opt.value === item.value)) return
    options.value.push(item)
  }
  const unregisterItem = (value: string) => {
    const index = options.value.findIndex((opt) => opt.value === value)
    if (index >= 0) options.value.splice(index, 1)
  }

  const collection = comboboxCollection({
    items: options.value,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  })

  const currentValue = computed(() => props.value ?? props.modelValue)

  const service = useMachine(comboboxMachine, {
    id: props.id,
    collection,
    value: currentValue.value !== undefined ? [currentValue.value] : undefined,
    defaultValue:
      props.value === undefined && props.modelValue === undefined && props.defaultValue
        ? [props.defaultValue]
        : undefined,
    onValueChange(details: ComboboxValueChangeDetails) {
      const nextValue = details.value?.[0]
      emit('update:value', nextValue)
      emit('update:modelValue', nextValue)
      emit('change', nextValue)
    },
    inputBehavior: 'autohighlight',
    open: true,
  })

  const api = computed(() => comboboxConnect(service, normalizeProps))

  watch(
    () => props.value ?? props.modelValue,
    (val) => {
      if (val !== undefined && val !== api.value?.value?.[0]) {
        api.value?.setValue([val])
      }
    }
  )

  return {
    api,
    registerItem,
    unregisterItem,
  }
}
