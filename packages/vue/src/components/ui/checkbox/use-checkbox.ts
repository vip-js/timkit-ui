import { computed } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { checkboxConnect, checkboxMachine } from "@timui/core";
import type { CheckboxVueProps } from "@timui/core";

type UseCheckboxEmit = {
    (event: "update:modelValue", value: boolean | "indeterminate"): void;
    (event: "update:checked", value: boolean | "indeterminate"): void;
    (event: "change", value: boolean | "indeterminate"): void;
};

export function useCheckbox(props: CheckboxVueProps, emit: UseCheckboxEmit) {
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
        value: props.value,
        onCheckedChange(details: { checked: boolean | "indeterminate" }) {
            emit("update:modelValue", details.checked);
            emit("update:checked", details.checked);
            emit("change", details.checked);
        },
    }));

    const service = useMachine(checkboxMachine, machineProps);
    const api = computed(() => checkboxConnect(service, normalizeProps));

    return api;
}
