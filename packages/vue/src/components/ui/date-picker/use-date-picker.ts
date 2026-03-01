import { computed } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { datePickerConnect, datePickerMachine } from "@timui/core";
import type { DatePickerVueProps, DatePickerVueValue, DatePickerMode, DatePickerRangeValue } from "@timui/core";
import { getLocalTimeZone } from "@internationalized/date";
import { parse as parseDateValue } from "@zag-js/date-picker";
import type { DateValue } from "@zag-js/date-picker";
import type { Placement } from "@zag-js/popper";

export type UseDatePickerProps = DatePickerVueProps & {
    numberOfMonths?: number;
};

type DatePickerModelValue =
    | Date
    | {
        from?: Date;
        to?: Date;
    }
    | undefined;

export type UseDatePickerEmits = {
    (e: "update:modelValue", value: DatePickerModelValue): void;
    (e: "change", value: DatePickerModelValue): void;
};

export function useDatePicker(props: UseDatePickerProps, emit: UseDatePickerEmits) {
    const localTimeZone = getLocalTimeZone();
    const toPickerDate = (input: string | Date) =>
        parseDateValue(
            input instanceof Date
                ? `${input.getFullYear()}-${String(input.getMonth() + 1).padStart(2, "0")}-${String(
                    input.getDate()
                ).padStart(2, "0")}`
                : input
        );

    const toDateValueArray = (value: DatePickerVueValue | undefined, mode: DatePickerMode) => {
        if (!value) return undefined;
        if (value instanceof Date) return [toPickerDate(value)];

        const range = value as DatePickerRangeValue;
        if (mode === "range") {
            const parsed: DateValue[] = [];
            if (range?.from) parsed.push(toPickerDate(range.from));
            if (range?.to) parsed.push(toPickerDate(range.to));
            return parsed.length ? parsed : undefined;
        }

        const fallback = range?.from ?? range?.to;
        return fallback ? [toPickerDate(fallback)] : undefined;
    };

    const toModelValue = (values: DateValue[], mode: DatePickerMode) => {
        if (mode === "range") {
            const from = values[0]?.toDate(localTimeZone);
            const to = values[1]?.toDate(localTimeZone);
            return from || to ? { from, to } : undefined;
        }
        return values[0]?.toDate(localTimeZone);
    };

    const machineProps = computed(() => {
        const controlledValue =
            props.modelValue !== undefined
                ? toDateValueArray(props.modelValue, props.mode || "single")
                : undefined;

        const defaultValue =
            props.modelValue === undefined
                ? toDateValueArray(props.defaultValue, props.mode || "single")
                : undefined;

        return {
            selectionMode: props.mode || "single",
            numOfMonths: props.numberOfMonths || 1,
            outsideDaySelectable: true,
            timeZone: localTimeZone,
            value: controlledValue,
            defaultValue,
            onValueChange(details: { value: DateValue[] }) {
                const next = toModelValue(details.value, props.mode || "single");
                emit("update:modelValue", next);
                emit("change", next);
            },
            positioning: {
                placement: "bottom-start" as Placement,
                gutter: 6,
            },
        };
    });

    const service = useMachine(datePickerMachine, machineProps);
    const api = computed(() => datePickerConnect(service, normalizeProps));

    return {
        api,
        localTimeZone,
    };
}
