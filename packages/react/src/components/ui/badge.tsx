'use client'

import * as React from 'react'
import { Slot } from './slot'
import type { AssertNoExtraKeys, BadgeProps as CoreBadgeProps } from '@timui/core'
import { badgeVariants, cn } from '@timui/core'

type BadgeProps = CoreBadgeProps & React.ComponentProps<'span'> & { asChild?: boolean }
type _BadgePropsGuard = AssertNoExtraKeys<
  BadgeProps,
  CoreBadgeProps & React.ComponentProps<'span'> & { asChild?: boolean }
>

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : 'span'

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
