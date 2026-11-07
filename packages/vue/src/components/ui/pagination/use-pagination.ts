import { paginationConnect, paginationMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watchEffect } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'

export type UsePaginationProps = {
  id?: string
  page?: number | null
  defaultPage?: number
  pageSize?: number
  defaultPageSize?: number
  count?: number
  siblingCount?: number
  boundaryCount?: number
  disabled?: boolean
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
  const passed = usePassedProp()
  const readPage = () => passed<number | null>(props, 'page')
  const initialPage = readPage()
  const current = ref<number | null>(
    initialPage === undefined ? (props.defaultPage ?? 1) : initialPage == null ? null : initialPage
  )
  const machineProps = computed(() => {
    const page = readPage()
    return {
      id: props.id ?? generatedId,
      pageSize: props.pageSize,
      defaultPageSize: props.defaultPageSize,
      count: props.count,
      siblingCount: props.siblingCount,
      boundaryCount: props.boundaryCount,
      ...(page === undefined ? { defaultPage: props.defaultPage } : { page: page == null ? 1 : page }),
      onPageChange(details: PaginationChangeDetails) {
        if (props.disabled) return
        if (readPage() === undefined) current.value = details.page
        props.onPageChange?.(details)
        emit('update:page', details.page)
        emit('change', { page: details.page, pageSize: details.pageSize })
      },
      onPageSizeChange(details: PaginationChangeDetails) {
        props.onPageSizeChange?.(details)
        emit('update:pageSize', details.pageSize)
      },
    }
  })

  const service = useMachine(paginationMachine as never, machineProps as never)

  watchEffect(() => {
    const controlled = readPage()
    if (controlled === undefined) {
      const page = (service.context as { get: (key: string) => unknown }).get('page')
      if (typeof page === 'number') current.value = page
      return
    }
    current.value = typeof controlled === 'number' && controlled > 0 ? controlled : null
  })

  const api = computed(() => {
    current.value
    return paginationConnect(service as never, normalizeProps)
  })

  return { api, page: current }
}
