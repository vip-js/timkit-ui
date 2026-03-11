import { selectCollection, selectConnect, selectMachine } from '@timui/core'
import type { SelectItem, SelectVueProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, watch } from 'vue'

type SelectEmits = {
  (e: 'update:modelValue', value?: string): void
  (e: 'change', value?: string): void
}

export function useSelect(props: SelectVueProps, emit: SelectEmits) {
  type SelectValueChangeDetails = Parameters<NonNullable<SelectVueProps['onValueChange']>>[0]

  const emptyItems: SelectItem[] = []
  const collection = computed(
    () => props.collection ?? selectCollection<SelectItem>({ items: emptyItems })
  )
  const currentValue = computed(() => {
    if (props.modelValue !== undefined) return props.modelValue
    if (props.value !== undefined) return props.value
    return undefined
  })

  const machineProps = computed(() => ({
    id: props.id,
    collection: collection.value,
    value: currentValue.value !== undefined ? [currentValue.value] : undefined,
    defaultValue:
      currentValue.value === undefined && props.defaultValue !== undefined
        ? [props.defaultValue]
        : undefined,
    onValueChange(details: SelectValueChangeDetails) {
      const nextValue = details.value?.[0]
      emit('update:modelValue', nextValue)
      emit('change', nextValue)
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
