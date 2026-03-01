import { computed, getCurrentInstance } from "vue";
import type { ComboboxVueProps as CoreComboboxProps } from "@timui/core";
import { comboboxCollection, comboboxConnect, comboboxMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";

type ComboboxItem = {
    value: string;
    label?: string;
    disabled?: boolean;
    [key: string]: string | number | boolean | null | undefined | object;
};

export type ComboboxProps = CoreComboboxProps & {
    class?: string;
    items?: ComboboxItem[];
};

export function useCombobox(props: ComboboxProps) {
    const instance = getCurrentInstance();

    const machineProps = computed(() => {
        const { class: _class, items, collection, id, ...rest } = props;
        return {
            ...rest,
            id: id ?? `combobox-${instance?.uid ?? 0}`,
            collection: collection ?? comboboxCollection({ items: items ?? [] }),
        };
    });

    const service = useMachine(comboboxMachine, machineProps);
    const api = computed(() => comboboxConnect(service, normalizeProps));

    return api;
}
