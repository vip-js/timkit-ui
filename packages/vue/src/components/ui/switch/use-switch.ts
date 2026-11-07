import { switchConnect, switchMachine } from '@timui/core'
import type { SwitchVueProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watchEffect } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

type SwitchEmits = {
  (event: 'update:modelValue', value: boolean): void
  (event: 'change', value: boolean): void
}

export function useSwitch(props: SwitchVueProps, emit: SwitchEmits) {
  const generatedId = useId()
  const passed = usePassedProp()

  const machineProps = computed(() => {
    const modelValue = passed<boolean>(props, 'modelValue')
    const checked = passed<boolean>(props, 'checked')
    const controlled = modelValue !== undefined ? modelValue : checked
    const checkedValue = controlled === null ? false : controlled
    return {
    id: props.id ?? generatedId,
    ...(checkedValue === undefined ? { defaultChecked: props.defaultChecked } : { checked: checkedValue }),
    ...(props.disabled ? { disabled: true } : {}),
    ...(props.readOnly ? { readOnly: true } : {}),
    required: props.required,
    name: props.name,
    value: props.value ?? 'on',
    onCheckedChange(details: { checked: boolean }) {
      props.onCheckedChange?.(details.checked)
      emit('update:modelValue', details.checked)
      emit('change', details.checked)
    },
    }
  })

  const service = useMachine(switchMachine, machineProps)
  const phase = ref(false)
  watchEffect(() => {
    phase.value = service.context.get('checked') === true
  })
  const api = computed(() => {
    phase.value
    return switchConnect(service, normalizeProps)
  })

  return api
}
