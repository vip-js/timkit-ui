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
    <div className="bg-background flex items-center rounded-full border p-1 shadow-sm">
      <div className="flex -space-x-1.5">
        {avatars.map((avatar) => (
          <Avatar onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} key={avatar.src} className="size-5 ring-1 ring-background">
            <AvatarImage src={avatar.src} alt={avatar.alt} />
          </Avatar>
        ))}
      </div>
      <p className="text-muted-foreground px-2 text-xs">
        Trusted by <strong className="text-foreground font-medium">60K+</strong> developers.
      </p>
    </div>
  )
}
