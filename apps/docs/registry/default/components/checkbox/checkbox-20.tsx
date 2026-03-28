'use client'

import { useId, useState } from 'react'
import { Checkbox, Label } from '@timui/react'
import { MoonIcon, SunIcon } from 'lucide-react'

export default function Component() {
  const id = useId()
  const [isDark, setIsDark] = useState(false)

  return (
    <fieldset className="space-y-4">
      <legend className="text-foreground text-sm leading-none font-medium">
        Dark mode toggle checkbox
      </legend>
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={isDark}
          onCheckedChange={(checked) => setIsDark(checked === true)}
        />
        <Label htmlFor={id} className="inline-flex items-center gap-2">
          <span className="border-input bg-background inline-flex size-9 items-center justify-center rounded-md border">
            {isDark ? (
              <MoonIcon size={16} aria-hidden="true" />
            ) : (
              <SunIcon size={16} aria-hidden="true" />
            )}
          </span>
          <span className="text-sm">{isDark ? 'Dark' : 'Light'} mode</span>
        </Label>
      </div>
    </fieldset>
  )
}
