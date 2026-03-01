import { AccordionTrigger, Button } from '@timui/react'
import { ChevronDownIcon } from 'lucide-react'

export default function Component() {
  return (
    <Button>
      Button
      <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
    </Button>
  )
}
