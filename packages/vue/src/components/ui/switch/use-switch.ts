import { computed } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { switchConnect, switchMachine } from "@timui/core";
import type { SwitchVueProps } from "@timui/core";

type SwitchEmits = {
    (event: "update:modelValue", value: boolean): void;
    (event: "change", value: boolean): void;
};

export function useSwitch(props: SwitchVueProps, emit: SwitchEmits) {
    const machineProps = computed(() => ({
        id: props.id,
        checked: props.modelValue ?? props.checked,
        defaultChecked:
            props.modelValue === undefined && props.checked === undefined
                ? props.defaultChecked
                : undefined,
        disabled: props.disabled,
        required: props.required,
        name: props.name,
        value: props.value ?? 'on',
        onCheckedChange(details: { checked: boolean }) {
            emit('update:modelValue', details.checked)
            emit('change', details.checked)
        },
    }));

    const service = useMachine(switchMachine, machineProps);
    const api = computed(() => switchConnect(service, normalizeProps));

    return api;
}
