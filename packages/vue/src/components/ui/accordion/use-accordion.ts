import { accordionConnect, accordionMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

export interface UseAccordionProps {
  modelValue?: string | string[]
  defaultValue?: string | string[]
  type?: 'single' | 'multiple'
  multiple?: boolean
  collapsible?: boolean
  disabled?: boolean
  id?: string
  onValueChange?: (value: string | string[]) => void
}

type AccordionEmits = {
  (event: 'update:modelValue', value: string | string[]): void
  (event: 'change', value: string | string[]): void
}

export const useAccordion = (props: UseAccordionProps, emit?: AccordionEmits) => {
  const generatedId = useId()
  const id = props.id ?? generatedId

  const toArray = (value?: string | string[] | null) => {
    if (value == null) return undefined
    return Array.isArray(value) ? value : value === '' ? [] : [value]
  }

  const toValue = (value: string[], multiple: boolean) => {
    if (multiple) return value
    return value[0] ?? ''
  }

  const machineProps = computed(() => {
    const multiple = props.type ? props.type === 'multiple' : !!props.multiple
    const value = toArray(props.modelValue)
    const defaultValue = toArray(props.defaultValue)
    return {
      id,
      multiple,
      collapsible: props.collapsible,
      disabled: props.disabled,
      value,
      defaultValue: value === undefined ? defaultValue : undefined,
      onValueChange(details: { value: string[] }) {
        const nextValue = toValue(details.value, multiple)
        props.onValueChange?.(nextValue)
        if (emit) {
          emit('update:modelValue', nextValue)
          emit('change', nextValue)
        }
      },
    }
  })

  const service = useMachine(accordionMachine, machineProps)
  return computed(() => accordionConnect(service, normalizeProps))
}
