'use client'

import * as React from 'react'
import { cn } from '@timui/core'

interface OTPInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'maxLength'> {
  maxLength?: number | string
}

const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(
  ({ className, maxLength = 6, ...props }, ref) => {
    const resolvedMaxLength = React.useMemo(() => {
      const raw = typeof maxLength === 'string' ? Number(maxLength) : maxLength
      if (!Number.isFinite(raw) || raw <= 0) return 6
      return Math.floor(raw)
    }, [maxLength])

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={resolvedMaxLength}
        className={cn(className)}
        {...props}
      />
    )
  }
)
OTPInput.displayName = 'OTPInput'

export { OTPInput }
