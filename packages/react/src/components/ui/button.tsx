'use client'

import * as React from 'react'
import type { ButtonProps as CoreButtonProps } from '@timui/core'
import { buttonVariants, cn, createTimEvent } from '@timui/core'

import { Slot } from './slot'

export type ButtonProps = CoreButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CoreButtonProps>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, id, label, asChild = false, disabled, loading, onClick, onPress, type, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const generatedId = React.useId()
    const buttonId = id ?? generatedId
    const ariaLabel = props['aria-label'] ?? (size === 'icon' ? label : undefined)
    const blocked = disabled || loading

    return (
      <>
      {loading ? <p role="status">Loading</p> : null}
      <Comp
        data-slot="button"
        data-loading={loading ? '' : undefined}
        id={buttonId}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        type={asChild ? type : (type ?? 'button')}
        disabled={blocked || undefined}
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          if (blocked) {
            event.preventDefault()
            return
          }
          onClick?.(event)
          onPress?.(createTimEvent('press', buttonId, {}))
        }}
      />
      </>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
