import { useId } from 'react'
import { AccordionTrigger, Checkbox, Label } from '@timui/react'

export default function Component() {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} />
      <Label htmlFor={id}>
        I agree to the{' '}
        <a className="underline" href="https://ui.timkit.cn" target="_blank">
          terms of service
        </a>
      </Label>
    </div>
  )
}
