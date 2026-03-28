import { checkboxConnect, checkboxMachine } from '@timui/core'
import type { CheckboxVueProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

type UseCheckboxEmit = {
  (event: 'update:modelValue', value: boolean | 'indeterminate'): void
  (event: 'update:checked', value: boolean | 'indeterminate'): void
  (event: 'change', value: boolean | 'indeterminate'): void
}

export function useCheckbox(props: CheckboxVueProps, emit: UseCheckboxEmit) {
  const generatedId = useId()

  const machineProps = computed(() => ({
    id: props.id ?? generatedId,
    checked: props.modelValue ?? props.checked,
    defaultChecked:
      props.modelValue === undefined && props.checked === undefined
        ? props.defaultChecked
        : undefined,
    disabled: props.disabled,
    required: props.required,
    name: props.name,
    value: props.value,
    onCheckedChange(details: { checked: boolean | 'indeterminate' }) {
      props.onCheckedChange?.(details.checked)
      emit('update:modelValue', details.checked)
      emit('update:checked', details.checked)
      emit('change', details.checked)
    },
  }))

  const service = useMachine(checkboxMachine, machineProps)
  const api = computed(() => checkboxConnect(service, normalizeProps))

  return api
}
