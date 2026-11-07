'use client'

import { useState } from 'react'

import { useId } from 'react'
import { Label, Textarea } from '@timui/react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Autogrowing textarea</Label>
      <Textarea value={demoValue} onChange={(event) => setDemoValue(event.target.value)}
        id={id}
        placeholder="Leave a comment"
        className="field-sizing-content max-h-29.5 min-h-0 resize-none py-1.75"
      />
    </div>
  )
}
