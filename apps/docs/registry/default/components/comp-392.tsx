import { AccordionTrigger, Avatar, AvatarFallback } from '@timui/react'
import { UserRoundIcon } from 'lucide-react'

export default function Component() {
  return (
    <Avatar>
      <AvatarFallback>
        <UserRoundIcon size={16} className="opacity-60" aria-hidden="true" />
      </AvatarFallback>
    </Avatar>
  )
}
