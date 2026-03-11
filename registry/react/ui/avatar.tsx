'use client'

import * as React from 'react'
import * as avatar from '@zag-js/avatar'
import { normalizeProps, useMachine } from '@zag-js/react'

import { cva } from '../lib/cva'
import { cn } from '../lib/utils'

const avatarRootVariants = cva('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full')
const avatarImageVariants = cva('aspect-square h-full w-full')
const avatarFallbackVariants = cva(
  'bg-muted flex h-full w-full items-center justify-center rounded-full'
)

const AvatarContext = React.createContext<{
  api: avatar.Api
} | null>(null)

function useAvatar() {
  const context = React.useContext(AvatarContext)
  if (!context) {
    throw new Error('Avatar components must be used within Avatar')
  }
  return context
}

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const service: avatar.Service = useMachine(avatar.machine, { id: React.useId() })
    const api = avatar.connect(service, normalizeProps)

    return (
      <AvatarContext.Provider value={{ api }}>
        <div
          ref={ref}
          {...api.getRootProps()}
          className={cn(avatarRootVariants(), className)}
          {...props}
        />
      </AvatarContext.Provider>
    )
  }
)
Avatar.displayName = 'Avatar'

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & { onLoadingStatusChange?: (status: any) => void }
>(({ className, src, srcSet, alt, onLoadingStatusChange, ...props }, ref) => {
  const { api } = useAvatar()

  return (
    <img
      ref={ref}
      {...api.getImageProps()}
      className={cn(avatarImageVariants(), className)}
      {...props}
    />
  )
})
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { api } = useAvatar()

    return (
      <div
        ref={ref}
        {...api.getFallbackProps()}
        className={cn(avatarFallbackVariants(), className)}
        {...props}
      />
    )
  }
)
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }
