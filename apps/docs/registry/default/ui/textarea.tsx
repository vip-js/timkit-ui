'use client'

import * as React from 'react'
import { cn, textareaVariants } from '@timui/core'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea data-slot="textarea" className={cn(textareaVariants(), className)} {...props} />
}
Textarea.displayName = 'Textarea'

export { Textarea }
