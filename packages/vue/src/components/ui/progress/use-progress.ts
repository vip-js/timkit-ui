import { normalizeProps, useMachine } from '@zag-js/vue'
import { progressConnect, progressMachine } from '@timui/core'
import { computed, watch } from 'vue'

export type UseProgressProps = {
    modelValue?: number | null
    max?: number
}

export function useProgress(props: UseProgressProps) {
    const machineProps = computed(() => ({
        value: props.modelValue ?? null,
        max: props.max ?? 100,
    }))

    const service = useMachine(progressMachine, machineProps)
    const api = computed(() => progressConnect(service, normalizeProps))

    watch(
        () => props.modelValue,
        (val) => {
            if (val !== undefined && val !== api.value.value) {
                api.value.setValue(val)
            }
        },
    )

    return api
}
