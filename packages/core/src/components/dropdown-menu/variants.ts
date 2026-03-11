import { cva } from 'class-variance-authority'

export const menuContentVariants = cva(
  'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md'
)
export const menuItemVariants = cva(
  'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
export const menuLabelVariants = cva('px-2 py-1.5 text-sm font-semibold')
export const menuSeparatorVariants = cva('bg-muted -mx-1 my-1 h-px')
export const menuShortcutVariants = cva('ms-auto text-xs tracking-widest opacity-60')

export const dropdownMenuContentVariants = menuContentVariants
export const dropdownMenuItemVariants = menuItemVariants
export const dropdownMenuLabelVariants = menuLabelVariants
export const dropdownMenuSeparatorVariants = menuSeparatorVariants
export const dropdownMenuShortcutVariants = menuShortcutVariants
export const dropdownMenuCheckboxItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
export const dropdownMenuRadioItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
export const dropdownMenuSubTriggerVariants = cva(
  'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent'
)
export const dropdownMenuSubContentVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
)
