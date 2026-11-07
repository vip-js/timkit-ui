import { createContext } from 'radix-vue'
import type { Ref } from 'vue'

export interface TimelineContextValue {
  activeStep: Ref<number | null>
  setActiveStep: (step: number) => void
  orientation: Ref<'horizontal' | 'vertical'>
  disabled: Ref<boolean>
  registerStep: (step: number) => void
}

export const [injectTimelineContext, provideTimelineContext] =
  createContext<TimelineContextValue>('Timeline')
