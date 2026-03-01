'use client'

import * as React from 'react'
import {
  avatarFallbackVariants,
  avatarImageVariants,
  avatarMachine,
  avatarVariants,
  cn,
} from '@timui/core'

import { useMachine } from '../hooks/use-machine'

const AvatarContext = React.createContext<{
  state: any
  send: (event: any) => void
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
    const [state, send] = useMachine(avatarMachine, {
      context: {},
    })

    const contextValue = React.useMemo(
      () => ({
        state,
        send,
      }),
      [state, send]
    )

    return (
      <AvatarContext.Provider value={contextValue}>
        <div ref={ref} data-slot="avatar" className={cn(avatarVariants(), className)} {...props} />
      </AvatarContext.Provider>
    )
  }
)
Avatar.displayName = 'Avatar'

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & { onLoadingStatusChange?: (status: any) => void }
>(({ className, src, srcSet, alt, onLoadingStatusChange, ...props }, ref) => {
  const { send, state } = useAvatar()
  const imageLoaded = state.context.loaded
  const hasError = state.context.error
  const [resolvedSrc, setResolvedSrc] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    if (!src) {
      setResolvedSrc(undefined)
      return
    }
    if (typeof src === 'string') {
      setResolvedSrc(src)
      return
    }
    const objectUrl = URL.createObjectURL(src)
    setResolvedSrc(objectUrl)
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [src])

  // Image Loading Logic
  React.useEffect(() => {
    if (!resolvedSrc) {
      send({ type: 'ERROR' })
      return
    }

    const image = new Image()
    image.src = resolvedSrc
    if (srcSet && typeof src === 'string') image.srcset = srcSet

    const onload = () => send({ type: 'LOADED' })
    const onerror = () => send({ type: 'ERROR' })

    image.onload = onload
    image.onerror = onerror

    if (image.complete) onload()

    return () => {
      image.onload = null
      image.onerror = null
    }
  }, [resolvedSrc, src, srcSet, send])

  if (hasError) return null

  return (
    <img
      ref={ref}
      src={resolvedSrc}
      srcSet={srcSet}
      alt={alt}
      data-slot="avatar-image"
      className={cn(avatarImageVariants(), className)}
      {...props}
    />
  )
})
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { state } = useAvatar()
    const loaded = state.context.loaded

    // Show fallback if NOT loaded (loading or error)
    if (loaded) return null

    return (
      <div
        ref={ref}
        data-slot="avatar-fallback"
        className={cn(avatarFallbackVariants(), className)}
        {...props}
      />
    )
  }
)
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }
