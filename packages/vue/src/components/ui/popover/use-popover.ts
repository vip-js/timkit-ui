import { computed, watch } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { popoverConnect, popoverMachine } from '@timui/core'
import type { PositioningOptions } from '@zag-js/popper'

export interface UsePopoverProps {
    id?: string
    open?: boolean
    defaultOpen?: boolean
    modal?: boolean
    closeOnInteractOutside?: boolean
    closeOnEscape?: boolean
    positioning?: PositioningOptions
}

export interface UsePopoverEmits {
    (e: 'update:open', value: boolean): void
    (e: 'change', value: boolean): void
}

let staticId = 0

export function usePopover(props: UsePopoverProps, emit: UsePopoverEmits) {
    const localId = `popover-${++staticId}`

    const machineProps = computed(() => ({
        id: props.id ?? localId,
        open: props.open,
        defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
        modal: props.modal,
        closeOnInteractOutside: props.closeOnInteractOutside,
        closeOnEscape: props.closeOnEscape,
        positioning: props.positioning,
        onOpenChange(details: { open: boolean }) {
            emit('update:open', details.open)
            emit('change', details.open)
        },
    }))

    const service = useMachine(popoverMachine, machineProps)
    const api = computed(() => popoverConnect(service, normalizeProps))

    watch(
        () => props.open,
        (val?: boolean) => {
            if (val !== undefined && val !== api.value.open) {
                api.value.setOpen(val)
            }
        }
    )

    return api
}
