import type { RadioGroupVueProps } from '@timui/core'
import { radioGroupConnect, radioGroupMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watchEffect } from 'vue'

type RadioGroupEmits = {
  (event: 'update:modelValue', value: string | null): void
  (event: 'change', value: string | null): void
}

export function useRadioGroup(
  props: RadioGroupVueProps & { orientation?: 'horizontal' | 'vertical' },
  emit: RadioGroupEmits
) {
  const generatedId = useId()

  const machineProps = computed(() => {
    const controlled = props.modelValue !== undefined ? props.modelValue : props.value
    return {
    id: props.id ?? generatedId,
    ...(controlled === undefined ? { defaultValue: props.defaultValue } : { value: controlled ?? '' }),
    disabled: props.disabled,
    readOnly: props.readOnly === true ? true : undefined,
    ...(props.orientation === 'horizontal' || props.orientation === 'vertical'
      ? { orientation: props.orientation }
      : {}),
    required: props.required,
    name: props.name,
    onValueChange(details: { value: string | null }) {
      props.onValueChange?.(details.value)
      emit('update:modelValue', details.value)
      emit('change', details.value)
    },
  }
  })

  const service = useMachine(radioGroupMachine, machineProps)
  const phase = ref('')
  watchEffect(() => {
    phase.value = String(service.context.get('value') ?? '')
  })
  return computed(() => {
    phase.value
    return radioGroupConnect(service, normalizeProps)
  })
}
