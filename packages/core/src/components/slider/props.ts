import type * as slider from '@zag-js/slider'
import type { TimEvent, LogicDefinition } from '../../shared'

export type SliderValueChangeEvent = TimEvent<{ value: number[] }>

export type SliderProps = Omit<slider.Props, 'onValueChange'> & {
    onValueChange?: (event: SliderValueChangeEvent) => void
}

export type SliderVueProps = {
    id?: string
    modelValue?: number[]
    value?: number[]
    defaultValue?: number[]
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    name?: string
    orientation?: 'horizontal' | 'vertical'
    onValueChange?: (details: { value: number[] }) => void
    onValueChangeEnd?: (details: { value: number[] }) => void
}

/**
 * Slider Logic Definition契约
 */
export type SliderLogic = LogicDefinition<SliderProps, slider.Api>
