'use client'

import { DatePicker, Label } from '@timui/react'

export default function Component() {
  return (
    <div className="*:not-first:mt-2">
      <Label className="text-foreground text-sm font-medium">Date picker</Label>
      <DatePicker />
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with TimUI atomic components + core Zag machine
      </p>
    </div>
  )
}
