import type { PaginationApi } from '@timui/core'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type PaginationContextValue = {
  api: ComputedRef<PaginationApi | null>
  page: Ref<number | null>
  disabled: ComputedRef<boolean>
}

export const PaginationContextKey = Symbol(
  'PaginationContext'
) as InjectionKey<PaginationContextValue>
