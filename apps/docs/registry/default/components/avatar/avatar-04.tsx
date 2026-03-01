import { Avatar, AvatarFallback, AvatarImage } from '@timui/react'

export default function Component() {
  return (
    <Avatar className="rounded-md">
      <AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" />
      <AvatarFallback>KK</AvatarFallback>
    </Avatar>
  )
}
