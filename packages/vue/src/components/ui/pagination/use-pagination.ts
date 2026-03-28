import { paginationConnect, paginationMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

export type UsePaginationProps = {
  id?: string
  page?: number
  defaultPage?: number
  pageSize?: number
  defaultPageSize?: number
  count?: number
  siblingCount?: number
  boundaryCount?: number
  onPageChange?: (details: PaginationChangeDetails) => void
  onPageSizeChange?: (details: PaginationChangeDetails) => void
}

type PaginationChangeDetails = {
  page: number
  pageSize: number
}

type UsePaginationEmit = {
  (event: 'update:page', page: number): void
  (event: 'change', details: PaginationChangeDetails): void
  (event: 'update:pageSize', pageSize: number): void
}

export function usePagination(props: UsePaginationProps, emit: UsePaginationEmit) {
  const generatedId = useId()

  const service = useMachine(
    paginationMachine as never,
    {
      id: props.id ?? generatedId,
      page: props.page,
      defaultPage: props.defaultPage,
      pageSize: props.pageSize,
      defaultPageSize: props.defaultPageSize,
      count: props.count,
      siblingCount: props.siblingCount,
      boundaryCount: props.boundaryCount,
      onPageChange(details: PaginationChangeDetails) {
        props.onPageChange?.(details)
        emit('update:page', details.page)
        emit('change', { page: details.page, pageSize: details.pageSize })
      },
      onPageSizeChange(details: PaginationChangeDetails) {
        props.onPageSizeChange?.(details)
        emit('update:pageSize', details.pageSize)
      },
    } as never
  )

  return computed(() => paginationConnect(service as never, normalizeProps))
}
