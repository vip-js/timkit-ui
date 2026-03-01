import { computed, watch } from "vue"
import { normalizeProps, useMachine } from "@zag-js/vue"
import { tooltipConnect, tooltipMachine } from "@timui/core"
import type { PositioningOptions } from "@zag-js/popper"

export interface UseTooltipProps {
    id?: string
    open?: boolean
    defaultOpen?: boolean
    openDelay?: number
    closeDelay?: number
    closeOnPointerDown?: boolean
    closeOnEscape?: boolean
    closeOnScroll?: boolean
    closeOnClick?: boolean
    interactive?: boolean
    positioning?: PositioningOptions
}

export interface UseTooltipEmits {
    (e: "update:open", value: boolean): void
    (e: "change", value: boolean): void
}

let staticId = 0

export function useTooltip(props: UseTooltipProps, emit: UseTooltipEmits) {
    const localId = `tooltip-${++staticId}`

    const machineProps = computed(() => ({
        id: props.id ?? localId,
        open: props.open,
        defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
        openDelay: props.openDelay,
        closeDelay: props.closeDelay,
        closeOnPointerDown: props.closeOnPointerDown,
        closeOnEscape: props.closeOnEscape,
        closeOnScroll: props.closeOnScroll,
        closeOnClick: props.closeOnClick,
        interactive: props.interactive,
        positioning: props.positioning,
        onOpenChange(details: { open: boolean }) {
            emit("update:open", details.open)
            emit("change", details.open)
        },
    }))

    const service = useMachine(tooltipMachine, machineProps)
    const api = computed(() => tooltipConnect(service, normalizeProps))

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
