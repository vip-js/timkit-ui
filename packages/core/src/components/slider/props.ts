import type * as slider from '@zag-js/slider'

import type { LogicDefinition, TimEvent } from '../../shared'

export type SliderValueChangeEvent = TimEvent<{ value: number[] }>

export type SliderProps = Omit<slider.Props, 'onValueChange'> & {
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (event: SliderValueChangeEvent) => void
  /**
   * Whether to show thumb tooltip labels.
   */
  showTooltip?: boolean
  /**
   * Custom formatter for tooltip labels.
   */
  tooltipContent?: (value: number) => string
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
   * The ids of the elements in the slider. Useful for composition.
   */
  ids?: slider.Props['ids']
  /**
   * The text direction.
   */
  dir?: slider.Props['dir']
  /**
   * Accessible labels for slider thumbs.
   */
  'aria-label'?: slider.Props['aria-label']
  /**
   * Accessible labelled-by ids for slider thumbs.
   */
  'aria-labelledby'?: slider.Props['aria-labelledby']
  /**
   * The name associated with each slider thumb.
   */
  name?: string
  /**
   * The associated form id.
   */
  form?: string
  /**
   * Whether the slider is disabled.
   */
  disabled?: boolean
  /**
   * Whether the slider is read-only.
   */
  readOnly?: boolean
  /**
   * Whether the slider is invalid.
   */
  invalid?: boolean
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
   * The minimum steps between thumbs for multi-thumb sliders.
   */
  minStepsBetweenThumbs?: number
  /**
   * The orientation of the component.
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * The origin of the slider range.
   */
  origin?: 'start' | 'center' | 'end'
  /**
   * Thumb alignment relative to track.
   */
  thumbAlignment?: 'contain' | 'center'
  /**
   * Thumb dimensions.
   */
  thumbSize?: slider.Props['thumbSize']
  /**
   * Collision behavior when thumbs cross.
   */
  thumbCollisionBehavior?: 'none' | 'push' | 'swap'
  /**
   * Function that returns a readable value for a thumb.
   */
  getAriaValueText?: slider.Props['getAriaValueText']
  /**
   * Callback fired when focused thumb changes.
   */
  onFocusChange?: slider.Props['onFocusChange']
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: number[]) => void
  /**
   * Callback fired when value commit ends.
   */
  onValueChangeEnd?: (value: number[]) => void
  /**
   * Whether to show thumb tooltip labels.
   */
  showTooltip?: boolean
  /**
   * Custom formatter for tooltip labels.
   */
  tooltipContent?: (value: number) => string
}

/**
 * Slider Logic Definition契约
 */
export type SliderLogic = LogicDefinition<SliderProps, slider.Api>
