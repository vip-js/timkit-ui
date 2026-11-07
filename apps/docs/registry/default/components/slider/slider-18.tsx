'use client'

import { useState } from 'react'
import { Label, Slider } from '@timui/react'

export default function Component() {
  const [value, setValue] = useState([3])

  const emojis = ['😡', '🙁', '😐', '🙂', '😍']
  const labels = ['Awful', 'Poor', 'Okay', 'Good', 'Amazing']

  return (
    <div className="*:not-first:mt-3">
      <Label>Rate your experience</Label>
      <div className="flex items-center gap-2">
        <Slider
          id="slider-18"
          value={value}
          onValueChange={(event) => setValue(event.detail.value)}
          min={1}
          max={5}
          showTooltip
          tooltipContent={(value) => labels[value - 1]}
          aria-label="Rate your experience"
        />
        <span className="text-2xl">{emojis[value[0] - 1]}</span>
      </div>
    </div>
  )
}
