import { useId } from 'react'
import { Checkbox, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoChecked, setDemoChecked] = useState(false)
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={demoChecked} onCheckedChange={(event) => setDemoChecked(event.detail.checked === true)} id={id} />
      <Label htmlFor={id}>Simple checkbox</Label>
    </div>
  )
}
