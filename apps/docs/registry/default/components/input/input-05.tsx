import { useId } from 'react'
import { Input, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <>
      <div className="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
        <Label htmlFor={id}>Input with colored border and ring</Label>
        <Input value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} placeholder="Email" type="email" />
      </div>
    </>
  )
}
