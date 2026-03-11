import * as React from 'react'
import { progressConnect, progressMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export type UseProgressProps = {
  value?: number | null
  max?: number
}

export function useProgress(props: UseProgressProps) {
  const { value, max = 100 } = props
  const generatedId = React.useId()

  const service = useMachine(progressMachine, {
    id: generatedId,
    value: value ?? null,
    max,
  })

  const api = React.useMemo(() => progressConnect(service, normalizeProps), [service])

  // Sync controlled value changes into the machine
  React.useEffect(() => {
    if (value !== undefined) {
      api.setValue(value)
    }
  }, [value, api])

  return {
    progressValue: api.value,
    percent: api.percent ?? 0,
  }
}
