'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import { cva, type VariantProps } from '../lib/cva'

const selectNativeVariants = cva(
  'border-input text-foreground focus-visible:border-ring focus-visible:ring-ring/50 has-[option[disabled]:checked]:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-full cursor-pointer appearance-none items-center rounded-md border text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      multiple: {
        true: '[&_option:checked]:bg-accent py-1 *:px-3 *:py-1',
        false: 'h-9 ps-3 pe-8',
      },
    },
    defaultVariants: {
      multiple: false,
    },
  }
)

export interface SelectNativeProps extends Omit<React.ComponentProps<'select'>, 'onValueChange'> {
  onValueChange?: (value: string | string[]) => void
}

function SelectNative({
  className,
  children,
  onValueChange,
  onChange,
  ...props
}: SelectNativeProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event)
    if (props.multiple) {
      const values = Array.from(event.target.selectedOptions).map((option) => option.value)
      onValueChange?.(values)
      return
    }
    onValueChange?.(event.target.value)
  }

  return (
    <div className="relative flex">
      <select
        data-slot="select-native"
        className={cn(selectNativeVariants({ multiple: props.multiple }), className)}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
      {!props.multiple && (
        <span className="text-muted-foreground/80 peer-aria-invalid:text-destructive/80 pointer-events-none absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center peer-disabled:opacity-50">
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      )}
    </div>
  )
}

export { SelectNative, selectNativeVariants }
