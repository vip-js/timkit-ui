import { useId } from 'react'
import { Label, Switch } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoChecked, setDemoChecked] = useState(false)
  const id = useId()
  return (
    <div className="inline-flex items-center gap-2">
      <Switch checked={demoChecked} onCheckedChange={(event) => setDemoChecked(event.detail.checked === true)} id={id} />
      <Label htmlFor={id} className="sr-only">
        Simple switch
      </Label>
    </div>
  )
}
