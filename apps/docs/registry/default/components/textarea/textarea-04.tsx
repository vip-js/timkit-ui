import { useId } from 'react'
import { Label, Textarea } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <div className="flex items-center justify-between gap-1">
        <Label htmlFor={id} className="leading-6">
          Textarea with hint
        </Label>
        <span className="text-muted-foreground text-sm">Optional</span>
      </div>
      <Textarea value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} placeholder="Leave a comment" />
    </div>
  )
}
