'use client'

import * as React from 'react'
import type { TextareaProps as CoreTextareaProps } from '@timui/core'
import { cn, textareaVariants, createTimEvent } from '@timui/core'

type TextareaProps = CoreTextareaProps &
  Omit<React.ComponentProps<'textarea'>, keyof CoreTextareaProps>

function Textarea({ className, id, onValueChange, onChange, ...props }: TextareaProps) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event)
    onValueChange?.(createTimEvent('change', textareaId, { value: event.target.value }))
  }

  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants(), className)}
      onChange={handleChange}
      {...props}
    />
  )
}
Textarea.displayName = 'Textarea'

export { Textarea }
