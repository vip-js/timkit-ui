import { restoreFocus } from '@timui/core'
import { ref, watch, type InjectionKey, type Ref } from 'vue'

export type RememberTrigger = (node: HTMLElement | null) => void

export const returnFocusKey: InjectionKey<RememberTrigger> = Symbol('return-focus')

export function useReturnFocus(open: Ref<boolean>) {
  const trigger = ref<HTMLElement | null>(null)
  const wasOpen = ref(open.value)

  watch(open, (next) => {
    if (wasOpen.value && !next) restoreFocus(trigger.value)
    wasOpen.value = next
  })

  const remember: RememberTrigger = (node) => {
    trigger.value = node
  }

  return remember
}
