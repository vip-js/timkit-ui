'use client'

import { AccordionTrigger, Label, Slider } from '@timui/react'

export default function Component() {
  return (
    <div className="*:not-first:mt-4">
      <Label>Slider with multiple thumbs</Label>
      <Slider
        defaultValue={[25, 50, 100]}
        aria-label="Slider with multiple thumbs"
        showTooltip
        tooltipContent={(value) => `${value}%`}
      />
    </div>
  )
}
