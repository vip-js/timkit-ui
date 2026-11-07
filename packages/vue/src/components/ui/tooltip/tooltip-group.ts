import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type TooltipGroup = {
  delayDuration: ComputedRef<number | undefined>
  skipDelayDuration: ComputedRef<number>
  disableHoverableContent: ComputedRef<boolean | undefined>
  lastOpened: Ref<number>
  markOpened: () => void
}

export const TooltipGroupKey: InjectionKey<TooltipGroup> = Symbol('tooltip-group')
