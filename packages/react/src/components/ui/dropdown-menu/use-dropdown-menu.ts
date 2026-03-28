import * as React from 'react'
import { menuConnect, menuMachine } from '@timui/core'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/react'

export type DropdownMenuProps = {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  closeOnSelect?: boolean
  loopFocus?: boolean
  positioning?: PositioningOptions
  onOpenChange?: (open: boolean) => void
  onSelect?: (value: string) => void
  children?: React.ReactNode
}

export function useDropdownMenu(props: DropdownMenuProps) {
  const { onOpenChange, onSelect, ...menuProps } = props
  const generatedId = React.useId()
  const service = useMachine(menuMachine, {
    id: menuProps.id ?? generatedId,
    open: menuProps.open,
    defaultOpen: menuProps.defaultOpen,
    closeOnSelect: menuProps.closeOnSelect,
    loopFocus: menuProps.loopFocus,
    positioning: menuProps.positioning,
    onOpenChange: (details: { open: boolean }) => onOpenChange?.(details.open),
    onSelect: (details: { value: string }) => onSelect?.(details.value),
  })
  return menuConnect(service, normalizeProps)
}
