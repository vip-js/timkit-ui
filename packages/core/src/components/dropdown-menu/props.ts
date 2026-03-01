import type * as menu from '@zag-js/menu'
import type { TimEvent, LogicDefinition } from '../../shared'

export type MenuOpenChangeEvent = TimEvent<{ open: boolean }>
export type MenuSelectEvent = TimEvent<{ value: string }>

export type MenuProps = Omit<menu.Props, 'onOpenChange' | 'onSelect'> & {
    onOpenChange?: (event: MenuOpenChangeEvent) => void
    onSelect?: (event: MenuSelectEvent) => void
}

export type DropdownMenuProps = MenuProps

/**
 * Menu Logic Definition契约
 */
export type MenuLogic = LogicDefinition<MenuProps, menu.Api>
