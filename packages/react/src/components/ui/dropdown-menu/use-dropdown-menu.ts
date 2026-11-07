import * as React from 'react'
import { menuConnect, menuMachine } from '@timui/core'
import type { PositioningOptions } from '@zag-js/popper'
import { normalizeProps, useMachine } from '@zag-js/react'

export type DropdownMenuProps = {
  id?: string
  open?: boolean | null
  defaultOpen?: boolean
  closeOnSelect?: boolean
  disabled?: boolean
  loopFocus?: boolean
  positioning?: PositioningOptions
  onOpenChange?: (open: boolean) => void
  onSelect?: (value: string) => void
  children?: React.ReactNode
}

export function useDropdownMenu(props: DropdownMenuProps) {
  const { onOpenChange, onSelect, open, defaultOpen, ...menuProps } = props
  const generatedId = React.useId()
  const openControlled = open !== undefined
  const service = useMachine(menuMachine, {
    id: menuProps.id ?? generatedId,
    ...(openControlled ? { open: open === true } : { defaultOpen }),
    closeOnSelect: menuProps.closeOnSelect,
    disabled: menuProps.disabled,
    loopFocus: menuProps.loopFocus,
    positioning: menuProps.positioning,
    onOpenChange: (details: { open: boolean }) => onOpenChange?.(details.open),
    onSelect: (details: { value: string }) => onSelect?.(details.value),
  })
  return menuConnect(service, normalizeProps)
}
