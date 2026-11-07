import { useId } from 'react'
import { Label, Switch } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoChecked, setDemoChecked] = useState(false)
  const id = useId()
  return (
    <div className="inline-flex items-center gap-2">
      <Switch checked={demoChecked} onCheckedChange={(checked) => setDemoChecked(checked === true)} id={id} disabled />
      <Label htmlFor={id} className="sr-only">
        Disabled
      </Label>
    </div>
  )
}
