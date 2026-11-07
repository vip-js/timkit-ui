import { useId } from 'react'
import { Input, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoValue, setDemoValue] = useState("")
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>File input</Label>
      <Input value={demoValue} onChange={(event) => setDemoValue(event.target.value)} id={id} className="p-0 pe-3 file:me-3 file:border-0 file:border-e" type="file" />
    </div>
  )
}
