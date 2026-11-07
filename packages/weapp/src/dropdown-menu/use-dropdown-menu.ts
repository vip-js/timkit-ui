import { menuConnect, menuMachine } from '@timui/core'

import { normalizeProps, useMachine, bindMachine } from '../utils/machine'

export type WeappDropdownMenuApi = {
  triggerProps?: { onClick?: () => void }
  selectItem?: (item: { value: string }) => void
  setOpen?: (open: boolean) => void
}

export type WeappDropdownMenuService = {
  setContext: (context: Record<string, object>) => void
}

export type WeappDropdownMenuContext = {
  id: string
  open: boolean | null
  closeOnSelect: boolean
  onOpenChange?: (details: { open: boolean }) => void
  onSelect?: (details: { value: string }) => void
}

type WeappDropdownMenuComponent = WechatMiniprogram.Component.TrivialInstance
type MachineSend = (event: string | { type: string; [key: string]: object }) => void

export function setupDropdownMenuMachine(
  component: WeappDropdownMenuComponent,
  context: WeappDropdownMenuContext
) {
  const machine = bindMachine(menuMachine, {
    id: context.id,
    defaultOpen: context.open === true ? true : undefined,
    closeOnSelect: context.closeOnSelect,
    onOpenChange: context.onOpenChange,
    onSelect: context.onSelect,
  })

  const controller = useMachine(component, machine)
  const service = controller.service as WeappDropdownMenuService
  const cleanup = controller.start()
  const send = controller.send as MachineSend

  return { service, cleanup, send }
}

export function connectDropdownMenuMachine(state: object, send: MachineSend) {
  return menuConnect(state as never, normalizeProps) as WeappDropdownMenuApi
}
