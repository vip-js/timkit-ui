'use client'

import { useState } from 'react'

import { DatePicker, Label } from '@timui/react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="*:not-first:mt-2">
      <Label onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} className="text-foreground text-sm font-medium">Date range picker</Label>
      <DatePicker mode="range" />
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with TimUI atomic components + core Zag machine
      </p>
    </div>
  )
}
