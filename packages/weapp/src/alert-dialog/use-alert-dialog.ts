import { dialogConnect, dialogMachine } from '@timui/core'

import { emitTimEvent } from '../utils'
import { normalizeProps, useMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type AlertDialogInstance = WechatMiniprogram.Component.TrivialInstance & {
  properties: { id?: string; open?: boolean }
  triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupAlertDialogMachine(instance: AlertDialogInstance) {
  const machine = dialogMachine({
    id: instance.properties.id || 'alert-dialog-1',
    open: instance.properties.open,
    role: 'alertdialog',
    onOpenChange: (details: { open: boolean }) => {
      instance.triggerEvent('change', details)
      emitTimEvent(
        instance,
        'openchange',
        'alertDialog.openChange',
        instance.properties.id || 'alert-dialog-1',
        { open: details.open }
      )
      if (details.open) {
        instance.triggerEvent('open')
      } else {
        instance.triggerEvent('close')
      }
    },
  })

  const controller = useMachine(instance, machine)

  return {
    controller,
    connect: (state: object, send: MachineSend) => dialogConnect(state, send, normalizeProps),
  }
}
