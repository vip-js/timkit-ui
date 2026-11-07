import { progressPercent } from '@timui/core'
import { computed } from 'vue'

export type UseProgressProps = {
  modelValue?: number | null
  max?: number
}

export function useProgress(props: UseProgressProps) {
  return computed(() => ({
    value: props.modelValue ?? null,
    percent: progressPercent(props.modelValue, 0, props.max ?? 100) ?? 0,
  }))
}
