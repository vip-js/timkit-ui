export type TableProps = {
  /**
   * When `true`, applies a striped pattern style.
   */
  striped?: boolean
  /**
   * When `true`, applies visual styles on user hover.
   */
  hoverable?: boolean
  /** Column id currently used for sorting. */
  sortColumn?: string
  /** Sort direction for sortColumn. */
  sortDirection?: 'asc' | 'desc'
  /** Selected row ids. */
  selectedIds?: string[]
  /** Text shown when the table has no rows. */
  emptyLabel?: string
  /** Called when the sort column or direction changes. */
  onSortChange?: (event: unknown) => void
  /** Called when the selected row ids change. */
  onSelectionChange?: (event: unknown) => void
}
