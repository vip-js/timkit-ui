'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, BadgeProps as CoreBadgeProps } from '@timui/core'
import { badgeVariants, cn } from '@timui/core'

import { Slot } from './slot'

type BadgeProps = CoreBadgeProps & React.ComponentProps<'span'> & { asChild?: boolean }
type _BadgePropsGuard = AssertNoExtraKeys<
  BadgeProps,
  CoreBadgeProps & React.ComponentProps<'span'> & { asChild?: boolean }
>

const Badge = React.memo(function Badge({
  className,
  variant,
  asChild = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      {...props}
      data-slot="badge"
      data-variant={variant || 'default'}
      className={cn(badgeVariants({ variant }), className)}
    >
      {variant === 'destructive' && !asChild ? <p role="status">Destructive</p> : null}
      {children}
    </Comp>
  )
})

export { Badge, badgeVariants }
