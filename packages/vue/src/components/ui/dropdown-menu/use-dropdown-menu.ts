import { computed } from "vue";
import { menuConnect, menuMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";
import type { PositioningOptions } from "@zag-js/popper";

export function useDropdownMenu(props: {
    id?: string;
    open?: boolean;
    defaultOpen?: boolean;
    closeOnSelect?: boolean;
    loopFocus?: boolean;
    positioning?: PositioningOptions;
}, emit: (event: "update:open" | "change", value: boolean) => void) {
    const machineProps = computed(() => ({
        id: props.id,
        open: props.open,
        defaultOpen: props.open === undefined ? props.defaultOpen : undefined,
        closeOnSelect: props.closeOnSelect,
        loopFocus: props.loopFocus,
        positioning: props.positioning,
        onOpenChange(details: { open: boolean }) {
            emit("update:open", details.open);
            emit("change", details.open);
        },
    }));

    const service = useMachine(menuMachine, machineProps);
    const api = computed(() => menuConnect(service, normalizeProps));

    return api;
}
