import { selectCollection, selectConnect, selectMachine } from '@timui/core'
import type { SelectItem, SelectVueProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watch, watchEffect, type ComputedRef } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

type SelectEmits = {
  (e: 'update:modelValue', value?: string): void
  (e: 'change', value?: string): void
}

export function useSelect(
  props: SelectVueProps,
  emit: SelectEmits,
  fallbackCollection?: ComputedRef<ReturnType<typeof selectCollection<SelectItem>>>
) {
  const generatedId = useId()
  const collection = computed(
    () => props.collection ?? fallbackCollection?.value ?? selectCollection<SelectItem>({ items: [] })
  )
  const currentValue = computed(() => {
    if (props.modelValue !== undefined) return props.modelValue
    if (props.value !== undefined) return props.value
    return undefined
  })

  const passed = usePassedProp()
  const machineProps = computed(() => {
    const open = passed<boolean | null>(props, 'open')
    const controlled = currentValue.value
    return {
    id: props.id ?? generatedId,
    collection: collection.value,
    ...(controlled === undefined
      ? { defaultValue: props.defaultValue !== undefined ? [props.defaultValue] : undefined }
      : { value: controlled == null || controlled === '' ? [] : [controlled] }),
    disabled: props.disabled,
    readOnly: props.readOnly === true ? true : undefined,
    required: props.required,
    name: props.name,
    ...(open === undefined ? { defaultOpen: props.defaultOpen } : { open: open === true }),
    onValueChange(details: { value: string[] }) {
      const nextValue = details.value?.[0]
      props.onValueChange?.(nextValue)
      emit('update:modelValue', nextValue)
      emit('change', nextValue)
    },
    onOpenChange(details: { open: boolean }) {
      props.onOpenChange?.(details.open)
    },
    }
  })

  const service = useMachine(selectMachine, machineProps)
  const phase = ref('')
  watchEffect(() => {
    const value = service.context.get('value')
    const highlighted = service.context.get('highlightedValue')
    phase.value = `${Array.isArray(value) ? value.join(',') : ''}|${highlighted ?? ''}`
  })
  const api = computed(() => {
    phase.value
    return selectConnect(service, normalizeProps)
  })

  watch(
    () => api.value.open,
    (open, _previous, onCleanup) => {
      if (!open) return
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return
        event.preventDefault()
        api.value.setOpen(false)
      }
      document.addEventListener('keydown', onKeyDown)
      onCleanup(() => document.removeEventListener('keydown', onKeyDown))
    }
  )

  watch(
    () => currentValue.value,
    (val) => {
      if (val === undefined) return
      const next = val == null || val === '' ? [] : [val]
      const current = api.value?.value ?? []
      if (next.length !== current.length || next[0] !== current[0]) api.value?.setValue(next)
    }
  )

  return api
}
