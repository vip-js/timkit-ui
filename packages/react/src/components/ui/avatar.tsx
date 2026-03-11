'use client'

import * as React from 'react'
import { avatarFallbackVariants, avatarImageVariants, avatarVariants, cn } from '@timui/core'

import { useAvatar } from './avatar/use-avatar'
import { AvatarProvider, useAvatarContext } from './avatar/use-avatar-context'

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const api = useAvatar({ id: React.useId() })

    return (
      <AvatarProvider value={api}>
        <div
          ref={ref}
          className={cn(avatarVariants(), className)}
          {...api.getRootProps()}
          {...props}
        />
      </AvatarProvider>
    )
  }
)
Avatar.displayName = 'Avatar'

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & {
    onLoadingStatusChange?: (status: 'loaded' | 'error') => void
  }
>(
  (
    { className, src, srcSet, alt, onLoadingStatusChange: _onLoadingStatusChange, ...props },
    ref
  ) => {
    const api = useAvatarContext()
    void _onLoadingStatusChange

    return (
      <img
        ref={ref}
        src={src}
        srcSet={srcSet}
        alt={alt}
        className={cn(avatarImageVariants(), className)}
        {...api.getImageProps()}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    const api = useAvatarContext()

    return (
      <span
        ref={ref}
        className={cn(avatarFallbackVariants(), className)}
        {...api.getFallbackProps()}
        {...props}
      />
    )
  }
)
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }
