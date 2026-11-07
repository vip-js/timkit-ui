import { useId } from 'react'
import { Checkbox, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoChecked, setDemoChecked] = useState(false)
  const id = useId()
  return (
    <div className="flex items-start gap-2">
      <Checkbox checked={demoChecked} onCheckedChange={(checked) => setDemoChecked(checked === true)} id={id} aria-describedby={`${id}-description`} />
      <div className="grid grow gap-2">
        <Label htmlFor={id}>
          Label{' '}
          <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
            (Sublabel)
          </span>
        </Label>
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          You can use this checkbox with a label and a description.
        </p>
      </div>
    </div>
  )
}
