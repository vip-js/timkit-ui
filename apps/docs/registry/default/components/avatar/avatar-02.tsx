import { Avatar, AvatarFallback } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Avatar onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks}>
      <AvatarFallback>KK</AvatarFallback>
    </Avatar>
  )
}
