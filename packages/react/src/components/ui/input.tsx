'use client'

import * as React from 'react'
import type { AssertNoExtraKeys, InputProps as CoreInputProps } from '@timui/core'
import { cn, inputVariants, createTimEvent } from '@timui/core'

type InputProps = CoreInputProps &
  Omit<React.ComponentProps<'input'>, keyof CoreInputProps>

function Input({ className, type, id, onValueChange, onChange, ...props }: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
    onValueChange?.(createTimEvent('change', inputId, { value: event.target.value }))
  }

  const inputType =
    type === 'search' ? 'search' : type === 'file' ? 'file' : 'default'

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ type: inputType }), className)}
      onChange={handleChange}
      {...props}
    />
  )
}

export { Input }
