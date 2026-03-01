import { useId } from 'react'
import { AccordionTrigger, Label, Switch } from '@timui/react'

export default function Component() {
  const id = useId()
  return (
    <div className="inline-flex items-center gap-2">
      <Switch id={id} disabled />
      <Label htmlFor={id} className="sr-only">
        Disabled
      </Label>
    </div>
  )
}
