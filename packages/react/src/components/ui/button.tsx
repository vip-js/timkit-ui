import * as React from 'react'
import type { ButtonProps as CoreButtonProps } from '@timui/core'
import { buttonVariants, cn, createTimEvent } from '@timui/core'

import { Slot } from './slot'

export type ButtonProps = CoreButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CoreButtonProps>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, id, asChild = false, onClick, onPress, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const generatedId = React.useId()
    const buttonId = id ?? generatedId

    return (
      <Comp
        data-slot="button"
        id={buttonId}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event)
          onPress?.(createTimEvent('press', buttonId, {}))
        }}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
