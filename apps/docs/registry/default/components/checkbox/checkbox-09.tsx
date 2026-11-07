import { useId } from 'react'
import { Checkbox, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoChecked, setDemoChecked] = useState(false)
  const id = useId()
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Checkbox checked={demoChecked} onCheckedChange={(checked) => setDemoChecked(checked === true)} id={`${id}-1`} />
        <Label htmlFor={`${id}-1`}>React</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-2`} />
        <Label htmlFor={`${id}-2`}>Next.js</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-3`} />
        <Label htmlFor={`${id}-3`}>Astro</Label>
      </div>
    </div>
  )
}
