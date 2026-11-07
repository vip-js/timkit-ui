'use client'

import * as React from 'react'
import type { BannerProps as CoreBannerProps } from '@timui/core'
import {
  bannerActionsVariants,
  bannerContentVariants,
  bannerDescriptionVariants,
  bannerIconVariants,
  bannerTitleVariants,
  bannerVariants,
  cn,
} from '@timui/core'

type BannerProps = CoreBannerProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'onClose'>

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant = 'default',
      dismissible = false,
      open: openProp,
      defaultOpen,
      onOpenChange,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const controlled = openProp != null
    const [uncontrolled, setUncontrolled] = React.useState(defaultOpen !== false)
    const open = controlled ? openProp === true : uncontrolled
    const close = () => {
      if (!dismissible || !open) return
      if (!controlled) setUncontrolled(false)
      onOpenChange?.(false)
      onClose?.()
    }
    if (!open) return null
    return (
      <div
        ref={ref}
        data-slot="banner"
        data-state="open"
        data-variant={variant}
        role="status"
        className={cn(bannerVariants(), className)}
        {...props}
      >
        {children}
        {dismissible ? (
          <button type="button" data-slot="banner-close" aria-label="Close" onClick={close}>
            ×
          </button>
        ) : null}
      </div>
    )
  }
)
Banner.displayName = 'Banner'

const BannerContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="banner-content"
      className={cn(bannerContentVariants(), className)}
      {...props}
    />
  )
)
BannerContent.displayName = 'BannerContent'

const BannerIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="banner-icon"
      aria-hidden="true"
      className={cn(bannerIconVariants(), className)}
      {...props}
    />
  )
)
BannerIcon.displayName = 'BannerIcon'

const BannerTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      data-slot="banner-title"
      className={cn(bannerTitleVariants(), className)}
      {...props}
    />
  )
)
BannerTitle.displayName = 'BannerTitle'

const BannerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="banner-description"
    className={cn(bannerDescriptionVariants(), className)}
    {...props}
  />
))
BannerDescription.displayName = 'BannerDescription'

const BannerActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="banner-actions"
      className={cn(bannerActionsVariants(), className)}
      {...props}
    />
  )
)
BannerActions.displayName = 'BannerActions'

export { Banner, BannerActions, BannerContent, BannerDescription, BannerIcon, BannerTitle }
