import { createContext } from "../../../hooks/create-context";
import type { MenuApi } from "@timui/core";
import type { ComputedRef } from "vue";

const context = createContext<ComputedRef<MenuApi>>({
    id: "dropdownMenuContext",
    providerName: "<DropdownMenu />",
});

export const DropdownMenuProvider: (value: ComputedRef<MenuApi>) => void = context[0];
export const useDropdownMenuContext: (fallback?: ComputedRef<MenuApi>) => ComputedRef<MenuApi> = context[1];
