import { computed, type ComputedRef } from 'vue'
import { dialogMachine, dialogConnect, type DialogApi } from '@timui/core'
import { useMachine, normalizeProps } from '@zag-js/vue'

export type UseSheetProps = {
    id?: string
    open?: boolean
    defaultOpen?: boolean
    modal?: boolean
    onOpenChange?: (details: { open: boolean }) => void
}

export function useSheet(props: UseSheetProps) {
    const service = useMachine(dialogMachine, {
        id: props.id,
        open: props.open,
        defaultOpen: props.defaultOpen,
        modal: props.modal ?? true,
        onOpenChange: props.onOpenChange,
    })

    return computed(() => dialogConnect(service, normalizeProps))
}
