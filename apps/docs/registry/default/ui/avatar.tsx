'use client'
'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@timui/shared'
import { cva } from 'class-variance-authority'

const avatarVariants = cva('relative flex size-8 shrink-0 overflow-hidden rounded-full')

const avatarImageVariants = cva('aspect-square size-full')

const avatarFallbackVariants = cva(
  'bg-secondary flex size-full items-center justify-center rounded-[inherit] text-xs'
)

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants(), className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(avatarImageVariants(), className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackVariants(), className)}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
