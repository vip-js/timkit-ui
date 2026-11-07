import { Avatar, AvatarFallback, AvatarImage } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="relative">
      <Avatar onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} className="rounded-md">
        <AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" />
        <AvatarFallback>KK</AvatarFallback>
      </Avatar>
      <span className="border-background absolute -end-1 -top-1 size-3 rounded-full border-2 bg-emerald-500">
        <span className="sr-only">Online</span>
      </span>
    </div>
  )
}
