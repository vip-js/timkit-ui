'use client'

import { useState } from 'react'

import { DateField, DateInput, Label } from '@timui/react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <DateField onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} className="*:not-first:mt-2" granularity="minute" hourCycle={24}>
      <Label className="text-foreground text-sm font-medium">Date and time input</Label>
      <DateInput />
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with{' '}
        <a
          className="hover:text-foreground underline"
          href="https://react-spectrum.adobe.com/react-aria/DateField.html"
          target="_blank"
          rel="noopener nofollow"
        >
          React Aria
        </a>
      </p>
    </DateField>
  )
}
