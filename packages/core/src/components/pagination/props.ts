import type * as pagination from '@zag-js/pagination'
import type { TimEvent, LogicDefinition } from '../../shared'

export type PaginationValueChangeEvent = TimEvent<{ page: number; pageSize: number }>
export type PaginationPageSizeChangeEvent = TimEvent<{ pageSize: number }>

export type PaginationProps = Omit<pagination.Props, 'onPageChange' | 'onPageSizeChange'> & {
    onPageChange?: (event: PaginationValueChangeEvent) => void
    onPageSizeChange?: (event: PaginationPageSizeChangeEvent) => void
}

/**
 * Pagination Logic Definition契约
 */
export type PaginationLogic = LogicDefinition<PaginationProps, pagination.Api>
