import type { InjectionKey, ComputedRef } from "vue";
import type { PaginationApi } from "@timui/core";

export type PaginationContextValue = {
  api: ComputedRef<PaginationApi | null>;
};

export const PaginationContextKey = Symbol("PaginationContext") as InjectionKey<PaginationContextValue>;
