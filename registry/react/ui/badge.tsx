'use client'

import * as React from 'react'
import { cva, type VariantProps } from '../lib/cva'
import { cn } from '@/lib/utils'
import { Slot } from './slot'

const badgeVariants = cva(
    'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive:
                    'border-transparent bg-destructive text-white shadow hover:bg-destructive/80',
                outline: 'text-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

type BadgeVariant = VariantProps<typeof badgeVariants>

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    BadgeVariant {
    asChild?: boolean
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
    const Comp = asChild ? Slot : 'span'
    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
}

export { Badge, badgeVariants }
