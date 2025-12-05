import { Avatar, AvatarFallback } from "@timkit/web"
import { UserRoundIcon } from "lucide-react"

export default function Component() {
  return (
    <Avatar>
      <AvatarFallback>
        <UserRoundIcon size={16} className="opacity-60" aria-hidden="true" />
      </AvatarFallback>
    </Avatar>
  )
}
