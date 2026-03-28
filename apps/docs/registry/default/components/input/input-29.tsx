'use client'

import { useState } from 'react'
import { Button, Input, Label } from '@timui/react'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  currencySign: 'accounting',
})

export default function Component() {
  const [value, setValue] = useState(99)

  return (
    <div className="*:not-first:mt-2">
      <Label>Number input with chevrons</Label>
      <div className="border-input bg-background relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm shadow-xs">
        <Input
          value={formatter.format(value)}
          readOnly
          className="h-full rounded-none border-0 tabular-nums shadow-none"
        />
        <div className="flex h-full flex-col border-l">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-1/2 w-8 rounded-none border-b"
            onClick={() => setValue((prev) => prev + 1)}
            aria-label="Increase value"
          >
            <ChevronUpIcon size={12} aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-1/2 w-8 rounded-none"
            onClick={() => setValue((prev) => prev - 1)}
            aria-label="Decrease value"
          >
            <ChevronDownIcon size={12} aria-hidden="true" />
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with TimUI atomic components
      </p>
    </div>
  )
}
