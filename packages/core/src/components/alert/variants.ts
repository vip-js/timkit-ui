import { cva, type VariantProps } from 'class-variance-authority'

export const alertVariants = cva(
  'relative w-full rounded-lg border border-border bg-background p-4 text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)
export const alertTitleVariants = cva('mb-1 font-medium leading-none tracking-tight')
export const alertDescriptionVariants = cva('text-sm [&_p]:leading-relaxed')

export type AlertVariants = VariantProps<typeof alertVariants>
