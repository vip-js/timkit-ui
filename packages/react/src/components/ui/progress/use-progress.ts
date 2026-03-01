import * as React from 'react'
import { progressConnect, progressMachine } from '@timui/core'
import { useMachine } from '../../../hooks/use-machine'

export type UseProgressProps = {
    value?: number | null
    max?: number
}

export function useProgress(props: UseProgressProps) {
    const { value, max = 100 } = props
    const [state, send] = useMachine(progressMachine, {
        context: {
            value,
            max
        }
    })

    const progressValue = typeof state.context.value === 'number' ? state.context.value : null
    const progressMax = typeof state.context.max === 'number' ? state.context.max : max

    const percent = progressValue != null && progressMax > 0
        ? Math.round((progressValue / progressMax) * 100)
        : 0

    React.useEffect(() => {
        if (value !== undefined && value !== progressValue) {
            send({ type: 'VALUE.SET', value })
        }
    }, [value, send, progressValue])

    return {
        progressValue,
        progressMax,
        percent,
    }
}
