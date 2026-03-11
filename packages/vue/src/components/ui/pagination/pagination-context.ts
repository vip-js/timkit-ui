import type { PaginationApi } from '@timui/core'
import type { ComputedRef, InjectionKey } from 'vue'

export type PaginationContextValue = {
  api: ComputedRef<PaginationApi | null>
}

export const PaginationContextKey = Symbol(
  'PaginationContext'
) as InjectionKey<PaginationContextValue>
