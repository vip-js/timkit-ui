import { checkboxConnect, checkboxMachine } from '@timui/core'
import type { CheckboxVueProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watchEffect } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

type UseCheckboxEmit = {
  (event: 'update:modelValue', value: boolean | 'indeterminate'): void
  (event: 'update:checked', value: boolean | 'indeterminate'): void
  (event: 'change', value: boolean | 'indeterminate'): void
}

export function useCheckbox(props: CheckboxVueProps, emit: UseCheckboxEmit) {
  const generatedId = useId()
  const passed = usePassedProp()

  const machineProps = computed(() => {
    const modelValue = passed<boolean | 'indeterminate'>(props, 'modelValue')
    const checked = passed<boolean | 'indeterminate'>(props, 'checked')
    const controlled = modelValue !== undefined ? modelValue : checked
    const checkedValue = controlled === null ? false : controlled
    return {
    id: props.id ?? generatedId,
    ...(checkedValue === undefined ? { defaultChecked: props.defaultChecked } : { checked: checkedValue }),
    disabled: props.disabled,
    readOnly: props.readOnly === true ? true : undefined,
    required: props.required,
    name: props.name,
    value: props.value,
    onCheckedChange(details: { checked: boolean | 'indeterminate' }) {
      props.onCheckedChange?.(details.checked)
      emit('update:modelValue', details.checked)
      emit('update:checked', details.checked)
      emit('change', details.checked)
    },
    }
  })

  const service = useMachine(checkboxMachine, machineProps)
  const phase = ref('')
  watchEffect(() => {
    phase.value = String(service.context.get('checked'))
  })
  const api = computed(() => {
    phase.value
    return checkboxConnect(service, normalizeProps)
  })

  return api
}
