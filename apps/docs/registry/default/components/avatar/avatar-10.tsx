import { Avatar, AvatarFallback, AvatarImage, Badge } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="relative">
      <Avatar className="rounded-md">
        <AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" />
        <AvatarFallback>KK</AvatarFallback>
      </Avatar>
      <Badge onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} className="border-background absolute -top-2 left-full min-w-5 -translate-x-3 px-1">
        6
      </Badge>
    </div>
  )
}
