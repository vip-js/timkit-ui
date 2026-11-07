import {
  tagsInputConnect,
  tagsInputMachine,
  type TagsInputApi,
  type TagsInputValueChangeDetails,
  type TagsInputVueProps,
} from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watch, watchEffect } from 'vue'

export type UseTagsInputProps = TagsInputVueProps

type TagsInputEmits = {
  (event: 'update:modelValue', value: string[]): void
  (event: 'change', value: string[]): void
  (event: 'valueChange', details: TagsInputValueChangeDetails): void
}

const isSameStringArray = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false
  return a.every((item, index) => item === b[index])
}

export function useTagsInput(props: UseTagsInputProps, emit?: TagsInputEmits) {
  const generatedId = useId()
  const currentValue = computed(() => (props.modelValue !== undefined ? props.modelValue : props.value))
  const machineValue = computed(() =>
    currentValue.value === undefined ? undefined : (currentValue.value ?? [])
  )

  const machineProps = computed(() => {
    const {
      modelValue: _modelValue,
      value: _value,
      defaultValue,
      inputValue,
      defaultInputValue,
      onValueChange,
      onInputValueChange,
      ...rest
    } = props

    return {
      ...rest,
      id: props.id ?? generatedId,
      ...(machineValue.value === undefined ? { defaultValue } : { value: machineValue.value }),
      inputValue,
      defaultInputValue: inputValue === undefined ? defaultInputValue : undefined,
      onValueChange(details: TagsInputValueChangeDetails) {
        onValueChange?.(details.value)
        emit?.('valueChange', details)
        emit?.('update:modelValue', details.value)
        emit?.('change', details.value)
      },
      onInputValueChange(details: { inputValue: string }) {
        onInputValueChange?.(details.inputValue)
      },
    }
  })

  const service = useMachine(tagsInputMachine, machineProps)
  const phase = ref(0)
  watchEffect(() => {
    const value = service.context.get('value') as string[] | undefined
    const highlighted = service.context.get('highlightedTagId')
    phase.value = (value?.length ?? 0) + (highlighted ? 1 : 0)
  })
  const api = computed(() => {
    phase.value
    return tagsInputConnect(service, normalizeProps)
  })

  watch(
    () => currentValue.value,
    (val) => {
      const next = val == null ? [] : val
      if (currentValue.value === undefined) return
      if (!isSameStringArray(next, api.value?.value ?? [])) {
        api.value?.setValue(next)
      }
    }
  )

  return api
}
