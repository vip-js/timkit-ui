import type * as pagination from '@zag-js/pagination'

import type { LogicDefinition, TimEvent } from '../../shared'

export type PaginationValueChangeEvent = TimEvent<{ page: number; pageSize: number }>
export type PaginationPageSizeChangeEvent = TimEvent<{ pageSize: number }>

export type PaginationProps = Omit<pagination.Props, 'onPageChange' | 'onPageSizeChange'> & {
  /**
   * Callback fired when the active page index changes.
   */
  onPageChange?: (event: PaginationValueChangeEvent) => void
  /**
   * Callback fired when the number of items per page changes.
   */
  onPageSizeChange?: (event: PaginationPageSizeChangeEvent) => void
}

/**
 * Pagination Logic Definition契约
 */
export type PaginationLogic = LogicDefinition<PaginationProps, pagination.Api>
