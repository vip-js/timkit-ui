import { computed } from "vue";
import { sliderConnect, sliderMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";
import type { SliderVueProps } from "@timui/core";

type SliderEmits = {
    (event: "update:modelValue", value: number[]): void;
    (event: "change", value: number[]): void;
    (event: "commit", value: number[]): void;
};

export function useSlider(props: SliderVueProps, emit: SliderEmits) {
    const machineProps = computed(() => ({
        id: props.id,
        value: props.modelValue ?? props.value,
        defaultValue:
            props.modelValue === undefined && props.value === undefined
                ? props.defaultValue
                : undefined,
        min: props.min ?? 0,
        max: props.max ?? 100,
        step: props.step ?? 1,
        disabled: props.disabled,
        onValueChange(details: { value: number[] }) {
            emit("update:modelValue", details.value);
            emit("change", details.value);
        },
        onValueChangeEnd(details: { value: number[] }) {
            emit("commit", details.value);
        },
    }));

    const service = useMachine(sliderMachine, machineProps);
    const api = computed(() => sliderConnect(service, normalizeProps));

    return api;
}
