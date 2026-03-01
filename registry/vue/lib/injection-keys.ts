/**
 * Centralized injection keys for Vue component context sharing.
 * Replaces all string-based inject<any>() calls with typed InjectionKey<T>.
 */
import type { InjectionKey } from 'vue'
import type * as tabs from '@zag-js/tabs'
import type * as tooltip from '@zag-js/tooltip'
import type * as dialog from '@zag-js/dialog'
import type * as menu from '@zag-js/menu'
import type * as combobox from '@zag-js/combobox'
import type * as tagsInput from '@zag-js/tags-input'
import type * as popover from '@zag-js/popover'
import type * as avatar from '@zag-js/avatar'
import type * as radioGroup from '@zag-js/radio-group'
import type * as select from '@zag-js/select'

// Zag-js API types (for components using zag state machines)
export const tabsContextKey: InjectionKey<tabs.Api> = Symbol('tabs')
export const tooltipContextKey: InjectionKey<tooltip.Api> = Symbol('tooltip')
export const dialogContextKey: InjectionKey<dialog.Api> = Symbol('dialog')
export const alertDialogContextKey: InjectionKey<dialog.Api> = Symbol('alert-dialog')
export const sheetContextKey: InjectionKey<dialog.Api> = Symbol('sheet')
export const dropdownMenuContextKey: InjectionKey<menu.Api> = Symbol('dropdown-menu')
export const comboboxContextKey: InjectionKey<combobox.Api<unknown>> = Symbol('combobox')
export const tagsInputContextKey: InjectionKey<tagsInput.Api> = Symbol('tags-input')
export const popoverContextKey: InjectionKey<popover.Api> = Symbol('popover')
export const avatarContextKey: InjectionKey<avatar.Api> = Symbol('avatar')
export const radioGroupContextKey: InjectionKey<radioGroup.Api> = Symbol('radio-group')
export const selectContextKey: InjectionKey<select.Api<unknown>> = Symbol('select')

// Command (non-zag, custom state)
export interface CommandContext {
  search: import('vue').Ref<string>
  setSearch: (v: string) => void
}
export const commandContextKey: InjectionKey<CommandContext> = Symbol('command')

// Hover-card (uses @zag-js/hover-card)
import type * as hoverCard from '@zag-js/hover-card'
export const hoverCardContextKey: InjectionKey<hoverCard.Api> = Symbol('hover-card')

// Collapsible (uses @zag-js/collapsible)
import type * as collapsible from '@zag-js/collapsible'
export const collapsibleContextKey: InjectionKey<collapsible.Api> = Symbol('collapsible')
