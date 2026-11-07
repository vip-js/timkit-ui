import { useId } from 'react'
import { Input, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <div className="flex items-center justify-between gap-1">
        <Label htmlFor={id} className="leading-6">
          Input with hint
        </Label>
        <span className="text-muted-foreground text-sm">Optional</span>
      </div>
      <Input value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} placeholder="Email" type="email" />
    </div>
  )
}
