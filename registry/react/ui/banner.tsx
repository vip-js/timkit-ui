'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const Banner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            data-slot="banner"
            className={cn('relative flex w-full items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3', className)}
            {...props}
        />
    )
)
Banner.displayName = 'Banner'

const BannerContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} data-slot="banner-content" className={cn('flex items-center gap-3', className)} {...props} />
    )
)
BannerContent.displayName = 'BannerContent'

const BannerIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} data-slot="banner-icon" className={cn('size-5 shrink-0', className)} {...props} />
    )
)
BannerIcon.displayName = 'BannerIcon'

const BannerTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h5 ref={ref} data-slot="banner-title" className={cn('text-sm font-medium', className)} {...props} />
    )
)
BannerTitle.displayName = 'BannerTitle'

const BannerDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} data-slot="banner-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
    )
)
BannerDescription.displayName = 'BannerDescription'

const BannerActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} data-slot="banner-actions" className={cn('flex items-center gap-2', className)} {...props} />
    )
)
BannerActions.displayName = 'BannerActions'

export { Banner, BannerActions, BannerContent, BannerDescription, BannerIcon, BannerTitle }
