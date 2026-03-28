import { selectCollection, selectConnect, selectMachine } from '@timui/core'
import type { SelectItem, SelectVueProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId, watch } from 'vue'

type SelectEmits = {
  (e: 'update:modelValue', value?: string): void
  (e: 'change', value?: string): void
}

export function useSelect(
  props: SelectVueProps,
  emit: SelectEmits,
  fallbackCollection?: ReturnType<typeof selectCollection<SelectItem>>
) {
  const generatedId = useId()
  const defaultCollection = fallbackCollection ?? selectCollection<SelectItem>({ items: [] })
  const collection = computed(() => props.collection ?? defaultCollection)
  const currentValue = computed(() => {
    if (props.modelValue !== undefined) return props.modelValue
    if (props.value !== undefined) return props.value
    return undefined
  })

  const machineProps = computed(() => ({
    id: props.id ?? generatedId,
    collection: collection.value,
    value: currentValue.value !== undefined ? [currentValue.value] : undefined,
    defaultValue:
      currentValue.value === undefined && props.defaultValue !== undefined
        ? [props.defaultValue]
        : undefined,
    disabled: props.disabled,
    required: props.required,
    name: props.name,
    open: props.open,
    defaultOpen: props.defaultOpen,
    onValueChange(details: { value: string[] }) {
      const nextValue = details.value?.[0]
      props.onValueChange?.(nextValue)
      emit('update:modelValue', nextValue)
      emit('change', nextValue)
    },
    onOpenChange(details: { open: boolean }) {
      props.onOpenChange?.(details.open)
    },
  }))

  const service = useMachine(selectMachine, machineProps)
  const api = computed(() => selectConnect(service, normalizeProps))

  watch(
    () => currentValue.value,
    (val) => {
      if (val !== undefined && val !== api.value?.value?.[0]) {
        api.value?.setValue([val])
      }
    }
  )

  return api
}
