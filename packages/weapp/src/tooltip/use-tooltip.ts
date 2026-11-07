import { tooltipConnect, tooltipMachine } from '@timui/core'

import { emitTimEvent } from '../utils'
import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type TooltipInstance = WechatMiniprogram.Component.TrivialInstance & {
  properties: {
    id?: string
    disabled?: boolean
    open?: boolean | null
    defaultOpen?: boolean | null
    openDelay?: number
    closeDelay?: number
  }
  triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupTooltipMachine(instance: TooltipInstance) {
  const machine = bindMachine(tooltipMachine, {
    id: instance.properties.id || 'tooltip-1',
    disabled: instance.properties.disabled || undefined,
    ...((instance.properties.open == null ? instance.properties.defaultOpen : instance.properties.open) ===
    true
      ? { defaultOpen: true }
      : {}),
    ...(instance.properties.openDelay === undefined ? {} : { openDelay: instance.properties.openDelay }),
    ...(instance.properties.closeDelay === undefined ? {} : { closeDelay: instance.properties.closeDelay }),
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
    connect: (state: object, send: MachineSend) => tooltipConnect(state as never, normalizeProps),
  }
}
