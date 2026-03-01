'use client'

import * as React from 'react'
import {
  bannerActionsVariants,
  bannerContentVariants,
  bannerDescriptionVariants,
  bannerIconVariants,
  bannerTitleVariants,
  bannerVariants,
  cn,
} from '@timui/core'

const Banner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="banner"
      className={cn(bannerVariants(), className)}
      {...props}
    />
  )
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
