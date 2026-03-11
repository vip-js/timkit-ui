import type * as slider from '@zag-js/slider'

import type { LogicDefinition, TimEvent } from '../../shared'

export type SliderValueChangeEvent = TimEvent<{ value: number[] }>

export type SliderProps = Omit<slider.Props, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: SliderValueChangeEvent) => void
}

export type SliderVueProps = {
  /**
   * A unique identifier for the component.
   */
  id?: string
  /**
   * The controlled value bound via `v-model` (Vue specific).
   */
  modelValue?: number[]
  /**
   * The controlled value of the component.
   */
  value?: number[]
  /**
   * The default value of the component when uncontrolled.
   */
  defaultValue?: number[]
  /**
   * The minimum allowed value.
   */
  min?: number
  /**
   * The maximum allowed value.
   */
  max?: number
  /**
   * The step interval for value changes.
   */
  step?: number
  /**
   * When `true`, prevents the user from interacting with the component.
   */
  disabled?: boolean
  /**
   * The name of the component, used when submitting an HTML form.
   */
  name?: string
  /**
   * The orientation of the component.
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (details: { value: number[] }) => void
  onValueChangeEnd?: (details: { value: number[] }) => void
}

/**
 * Slider Logic Definition契约
 */
export type SliderLogic = LogicDefinition<SliderProps, slider.Api>
