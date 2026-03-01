'use client'

import * as React from 'react'
import { badgeVariants, cn, type BadgeVariants } from '@timui/core'
import type { VariantProps } from 'class-variance-authority'

import { Slot } from './slot'

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
