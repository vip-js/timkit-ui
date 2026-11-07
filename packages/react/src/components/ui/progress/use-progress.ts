import { progressPercent } from '@timui/core'

export type UseProgressProps = {
  value?: number | null
  max?: number
}

export function useProgress(props: UseProgressProps) {
  const { value, max = 100 } = props
  return {
    progressValue: value ?? null,
    percent: progressPercent(value, 0, max) ?? 0,
  }
}
