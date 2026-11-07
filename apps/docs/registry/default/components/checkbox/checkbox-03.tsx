import { useId } from 'react'
import { Checkbox, Label } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoChecked, setDemoChecked] = useState(false)
  const id = useId()
  return (
    <div className="flex items-center gap-2 [--primary:var(--color-indigo-500)] [--ring:var(--color-indigo-300)] in-[.dark]:[--primary:var(--color-indigo-500)] in-[.dark]:[--ring:var(--color-indigo-900)]">
      <Checkbox checked={demoChecked} onCheckedChange={(checked) => setDemoChecked(checked === true)} id={id} defaultChecked />
      <Label htmlFor={id}>Colored checkbox</Label>
    </div>
  )
}
