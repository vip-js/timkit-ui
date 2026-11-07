import { Avatar, AvatarFallback, AvatarImage, Button } from '@timui/react'
import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="ghost" className="h-auto p-0 hover:bg-transparent">
      <Avatar>
        <AvatarImage src="./avatar.jpg" alt="Profile image" />
        <AvatarFallback>KK</AvatarFallback>
      </Avatar>
      <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
    </Button>
  )
}
