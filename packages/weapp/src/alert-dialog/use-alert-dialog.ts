import { dialogConnect, dialogMachine } from '@timui/core'

import { emitTimEvent } from '../utils'
import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void
type AlertDialogInstance = WechatMiniprogram.Component.TrivialInstance & {
  properties: { id?: string; open?: boolean | null; defaultOpen?: boolean | null }
  triggerEvent: (name: string, detail?: Record<string, object>) => void
}

export function setupAlertDialogMachine(instance: AlertDialogInstance) {
  const machine = bindMachine(dialogMachine, {
    id: instance.properties.id || 'alert-dialog-1',
    defaultOpen: (instance.properties.open == null
      ? instance.properties.defaultOpen
      : instance.properties.open) === true
      ? true
      : undefined,
    role: 'alertdialog',
    closeOnInteractOutside: false,
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
    connect: (state: object, send: MachineSend) => dialogConnect(state as never, normalizeProps),
  }
}
