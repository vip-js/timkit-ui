import { inject, provide, type ComputedRef } from "vue";
import type { ComboboxApi } from "@timui/core";

export const ComboboxContextKey = Symbol("comboboxContext");

export function provideComboboxContext(context: ComputedRef<ComboboxApi>) {
    provide(ComboboxContextKey, context);
}

export function useComboboxContext(): ComputedRef<ComboboxApi> {
    const context = inject<ComputedRef<ComboboxApi>>(ComboboxContextKey);
    if (!context) {
        throw new Error("useComboboxContext must be used within a Combobox component");
    }
    return context;
}
