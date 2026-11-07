import { Avatar, AvatarImage } from '@timui/react'
import { useState } from 'react'

const avatars = [
  { src: '/avatar-80-03.jpg', alt: 'Avatar 01' },
  { src: '/avatar-80-04.jpg', alt: 'Avatar 02' },
  { src: '/avatar-80-05.jpg', alt: 'Avatar 03' },
  { src: '/avatar-80-06.jpg', alt: 'Avatar 04' },
]

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="flex -space-x-[0.525rem]">
      {avatars.map((avatar) => (
        <Avatar onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} key={avatar.src} className="size-7 ring-2 ring-background">
          <AvatarImage src={avatar.src} alt={avatar.alt} />
        </Avatar>
      ))}
    </div>
  )
}
