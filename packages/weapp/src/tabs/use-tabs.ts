import { tabsMachine, tabsConnect } from '@timui/core'
import { useMachine, normalizeProps } from '../utils/machine'

type TabsOrientation = 'horizontal' | 'vertical'
type TabsActivationMode = 'manual' | 'automatic'
type MachineSend = (event: string | { type: string; [key: string]: object }) => void
type TabsMachineInstance = WechatMiniprogram.Component.TrivialInstance & {
    properties: {
        id?: string
        value?: string
        orientation?: string
        activationMode?: string
    }
    triggerEvent: (name: string, detail?: Record<string, object>) => void
}

function toOrientation(value: string): TabsOrientation {
    return value === 'vertical' ? 'vertical' : 'horizontal'
}

function toActivationMode(value: string): TabsActivationMode {
    return value === 'manual' ? 'manual' : 'automatic'
}

export function setupTabsMachine(instance: TabsMachineInstance) {
    const machine = tabsMachine({
        id: instance.properties.id || 'tabs',
        value: instance.properties.value,
        orientation: toOrientation(instance.properties.orientation),
        activationMode: toActivationMode(instance.properties.activationMode),
        onValueChange: (details: { value: string }) => {
            instance.triggerEvent('change', details)
        },
    })

    const controller = useMachine(instance, machine)

    return {
        controller,
        connect: (state: object, send: MachineSend) => tabsConnect(state, send, normalizeProps)
    }
}
