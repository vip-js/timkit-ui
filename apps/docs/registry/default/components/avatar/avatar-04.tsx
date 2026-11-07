import { Avatar, AvatarFallback, AvatarImage } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Avatar onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} className="rounded-md">
      <AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" />
      <AvatarFallback>KK</AvatarFallback>
    </Avatar>
  )
}
