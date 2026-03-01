import { AccordionTrigger, Badge } from '@timui/react'
import { ZapIcon } from 'lucide-react'

export default function Component() {
  return (
    <Badge>
      <ZapIcon className="-ms-0.5 opacity-60" size={12} aria-hidden="true" />
      Badge
    </Badge>
  )
}
