import type * as menu from '@zag-js/menu'

import type { LogicDefinition, TimEvent } from '../../shared'

export type MenuOpenChangeEvent = TimEvent<{ open: boolean }>
export type MenuSelectEvent = TimEvent<{ value: string }>

export type MenuProps = Omit<menu.Props, 'id' | 'onOpenChange' | 'onSelect'> & {
  id?: string
  /**
   * When true, opening and selection are ignored.
   */
  disabled?: boolean
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (event: MenuOpenChangeEvent) => void
  /**
   * Callback fired when an item is selected.
   */
  onSelect?: (event: MenuSelectEvent) => void
}

export type DropdownMenuProps = MenuProps

/**
 * Menu Logic Definition契约
 */
export type MenuLogic = LogicDefinition<MenuProps, menu.Api>
