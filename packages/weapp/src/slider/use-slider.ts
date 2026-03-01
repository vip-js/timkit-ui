import { sliderMachine, sliderConnect } from '@timui/core'
import { useMachine, normalizeProps } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type SliderInstance = WechatMiniprogram.Component.TrivialInstance & {
    properties: {
        id?: string
        value?: number[]
        min?: number
        max?: number
        step?: number
        orientation?: 'horizontal' | 'vertical'
        disabled?: boolean
        name?: string
    }
    triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupSliderMachine(instance: SliderInstance) {
    const machine = sliderMachine({
        id: instance.properties.id || 'slider',
        value: instance.properties.value,
        min: instance.properties.min,
        max: instance.properties.max,
        step: instance.properties.step,
        orientation: instance.properties.orientation as 'horizontal' | 'vertical',
        disabled: instance.properties.disabled,
        name: instance.properties.name,
        onValueChange: (details: { value: number[] }) => {
            // @ts-ignore
            instance.triggerEvent('change', details)
        },
    })

    const controller = useMachine(instance, machine)

    return {
        controller,
        connect: (state: object, send: MachineSend) =>
            sliderConnect(state, send, normalizeProps)
    }
}
