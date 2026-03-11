import type { ComboboxApi } from '@timui/core'
import { type PropTypes } from '@zag-js/vue'
import { inject, provide, type ComputedRef } from 'vue'

import type { CommandItem } from './use-command'

export interface CommandContext {
  api: ComputedRef<ComboboxApi<PropTypes>>
  registerItem: (item: CommandItem) => void
  unregisterItem: (value: string) => void
}

const CommandContextKey = Symbol('CommandContext')

export function provideCommandContext(context: CommandContext) {
  provide(CommandContextKey, context)
}

export function useCommandContext() {
  const context = inject<CommandContext>(CommandContextKey)
  if (!context) {
    throw new Error('useCommandContext must be used within a CommandProvider')
  }
  return context
}
