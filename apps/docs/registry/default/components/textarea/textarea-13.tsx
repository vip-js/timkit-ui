import { useId } from 'react'
import { Label, Textarea } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="group relative">
      <Label
        htmlFor={id}
        className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
      >
        Textarea with overlapping label
      </Label>
      <Textarea value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} />
    </div>
  )
}
