import { switchConnect, switchMachine } from '@timui/core'
import type { SwitchVueProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

type SwitchEmits = {
  (event: 'update:modelValue', value: boolean): void
  (event: 'change', value: boolean): void
}

export function useSwitch(props: SwitchVueProps, emit: SwitchEmits) {
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
    value: props.value ?? 'on',
    onCheckedChange(details: { checked: boolean }) {
      props.onCheckedChange?.(details.checked)
      emit('update:modelValue', details.checked)
      emit('change', details.checked)
    },
  }))

  const service = useMachine(switchMachine, machineProps)
  const api = computed(() => switchConnect(service, normalizeProps))

  return api
}
