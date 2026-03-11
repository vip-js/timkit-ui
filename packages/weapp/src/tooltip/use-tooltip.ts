import { tooltipConnect, tooltipMachine } from '@timui/core'

import { emitTimEvent } from '../utils'
import { normalizeProps, useMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type TooltipInstance = WechatMiniprogram.Component.TrivialInstance & {
  properties: {
    id?: string
    disabled?: boolean
    openDelay?: number
    closeDelay?: number
  }
  triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupTooltipMachine(instance: TooltipInstance) {
  const machine = tooltipMachine({
    id: instance.properties.id || 'tooltip-1',
    disabled: instance.properties.disabled,
    openDelay: instance.properties.openDelay,
    closeDelay: instance.properties.closeDelay,
    onOpenChange: (details: { open: boolean }) => {
      instance.triggerEvent('change', details)
      emitTimEvent(
        instance,
        'openchange',
        'tooltip.openChange',
        instance.properties.id || 'tooltip-1',
        { open: details.open }
      )
    },
  })

  const controller = useMachine(instance, machine)

  return {
    controller,
    connect: (state: object, send: MachineSend) => tooltipConnect(state, send, normalizeProps),
  }
}
