import { Avatar, AvatarImage } from '@timui/react'

const avatars = [
  { src: '/avatar-80-03.jpg', alt: 'Avatar 01' },
  { src: '/avatar-80-04.jpg', alt: 'Avatar 02' },
  { src: '/avatar-80-05.jpg', alt: 'Avatar 03' },
  { src: '/avatar-80-06.jpg', alt: 'Avatar 04' },
]

export default function Component() {
  return (
    <div className="flex -space-x-1.5">
      {avatars.map((avatar) => (
        <Avatar key={avatar.src} className="size-5 ring-1 ring-background">
          <AvatarImage src={avatar.src} alt={avatar.alt} />
        </Avatar>
      ))}
    </div>
  )
}
