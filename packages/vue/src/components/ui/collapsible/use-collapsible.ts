import { computed } from 'vue'
import { collapsibleMachine, collapsibleConnect } from '@timui/core'
import { useMachine, normalizeProps } from '@zag-js/vue'

type CollapsibleProps = {
    id?: string
    open?: boolean
    defaultOpen?: boolean
    disabled?: boolean
    onOpenChange?: (details: { open: boolean }) => void
}

export function useCollapsible(props: CollapsibleProps = {}) {
    const service = useMachine(collapsibleMachine, {
        id: props.id,
        open: props.open,
        defaultOpen: props.defaultOpen,
        disabled: props.disabled,
        onOpenChange: props.onOpenChange,
    })

    return computed(() => collapsibleConnect(service, normalizeProps))
}
