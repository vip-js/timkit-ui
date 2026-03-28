import type { ComboboxVueProps as CoreComboboxProps } from '@timui/core'
import { comboboxCollection, comboboxConnect, comboboxMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

type ComboboxItem = {
  value: string
  label?: string
  disabled?: boolean
  [key: string]: string | number | boolean | null | undefined | object
}

export type ComboboxProps = CoreComboboxProps & {
  class?: string
  items?: ComboboxItem[]
}

export function useCombobox(props: ComboboxProps) {
  const generatedId = useId()

  const machineProps = computed(() => {
    const {
      class: _class,
      items,
      collection,
      id,
      onValueChange,
      onInputValueChange,
      onOpenChange,
      ...rest
    } = props
    return {
      ...rest,
      id: id ?? generatedId,
      collection: collection ?? comboboxCollection({ items: items ?? [] }),
      onValueChange(details: { value: string[] }) {
        onValueChange?.(details.value)
      },
      onInputValueChange(details: { inputValue: string }) {
        onInputValueChange?.(details.inputValue)
      },
      onOpenChange(details: { open: boolean }) {
        onOpenChange?.(details.open)
      },
    }
  })

  const service = useMachine(comboboxMachine, machineProps)
  const api = computed(() => comboboxConnect(service, normalizeProps))

  return api
}
