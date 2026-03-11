import { popoverConnect, popoverMachine } from '@timui/core'

import { emitTimEvent } from '../utils'
import { normalizeProps, useMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type PopoverInstance = WechatMiniprogram.Component.TrivialInstance & {
  properties: {
    id?: string
    open?: boolean
    modal?: boolean
    portalled?: boolean
    closeOnInteractOutside?: boolean
  }
  triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupPopoverMachine(instance: PopoverInstance) {
  const machine = popoverMachine({
    id: instance.properties.id || 'popover-1',
    open: instance.properties.open,
    modal: instance.properties.modal,
    portalled: instance.properties.portalled,
    closeOnInteractOutside: instance.properties.closeOnInteractOutside,
    onOpenChange: (details: { open: boolean }) => {
      instance.triggerEvent('change', details)
      emitTimEvent(
        instance,
        'openchange',
        'popover.openChange',
        instance.properties.id || 'popover-1',
        { open: details.open }
      )
    },
  })

  const controller = useMachine(instance, machine)

  return {
    controller,
    connect: (state: object, send: MachineSend) => popoverConnect(state, send, normalizeProps),
  }
}
