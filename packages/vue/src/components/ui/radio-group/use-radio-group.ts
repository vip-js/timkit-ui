import { computed } from "vue";
import type { RadioGroupVueProps } from "@timui/core";
import { radioGroupConnect, radioGroupMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";

type RadioGroupEmits = {
    (event: "update:modelValue", value: string | null): void;
    (event: "change", value: string | null): void;
};

export function useRadioGroup(props: RadioGroupVueProps, emit: RadioGroupEmits) {
    const machineProps = computed(() => ({
        id: props.id,
        value: props.modelValue ?? props.value,
        defaultValue:
            props.modelValue === undefined && props.value === undefined
                ? props.defaultValue
                : undefined,
        disabled: props.disabled,
        required: props.required,
        name: props.name,
        onValueChange(details: { value: string | null }) {
            emit("update:modelValue", details.value);
            emit("change", details.value);
        },
    }));

    const service = useMachine(radioGroupMachine, machineProps);
    const api = computed(() => radioGroupConnect(service, normalizeProps));

    return api;
}
