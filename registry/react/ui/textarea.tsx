'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import { cva } from '../lib/cva'

const textareaVariants = cva(
  'border-input placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex min-h-19.5 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50'
)

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function Textarea({ className, ...props }: TextareaProps) {
  return <textarea data-slot="textarea" className={cn(textareaVariants(), className)} {...props} />
}
Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
