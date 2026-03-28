import {
  tagsInputConnect,
  tagsInputMachine,
  type TagsInputApi,
  type TagsInputValueChangeDetails,
  type TagsInputVueProps,
} from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId, watch } from 'vue'

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
  const currentValue = computed(() => props.modelValue ?? props.value)

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
      value: currentValue.value,
      defaultValue: currentValue.value === undefined ? defaultValue : undefined,
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
  const api = computed(() => tagsInputConnect(service, normalizeProps))

  watch(
    () => currentValue.value,
    (val) => {
      if (!val) return
      if (!isSameStringArray(val, api.value?.value ?? [])) {
        api.value?.setValue(val)
      }
    }
  )

  return api
}
