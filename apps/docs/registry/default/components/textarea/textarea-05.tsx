import { useId } from 'react'
import { Label, Textarea } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
      <Label htmlFor={id}>Textarea with colored border and ring</Label>
      <Textarea value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} placeholder="Leave a comment" />
    </div>
  )
}
