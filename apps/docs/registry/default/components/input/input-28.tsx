'use client'

import { useId, useState } from 'react'
import { Button, Input, Label } from '@timui/react'
import { MinusIcon, PlusIcon } from 'lucide-react'

export default function Component() {
  const id = useId()
  const [value, setValue] = useState(2048)

  const decrement = () => setValue((prev) => Math.max(0, prev - 1))
  const increment = () => setValue((prev) => prev + 1)

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Number input with plus/minus buttons</Label>
      <div className="border-input bg-background relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm shadow-xs">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-full rounded-none border-r"
          onClick={decrement}
          aria-label="Decrease value"
        >
          <MinusIcon size={16} aria-hidden="true" />
        </Button>
        <Input
          id={id}
          type="number"
          min={0}
          value={String(value)}
          onChange={(event) => {
            const next = Number(event.target.value)
            setValue(Number.isFinite(next) ? Math.max(0, next) : 0)
          }}
          className="h-full rounded-none border-0 text-center tabular-nums shadow-none"
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-full rounded-none border-l"
          onClick={increment}
          aria-label="Increase value"
        >
          <PlusIcon size={16} aria-hidden="true" />
        </Button>
      </div>
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with TimUI atomic components
      </p>
    </div>
  )
}
