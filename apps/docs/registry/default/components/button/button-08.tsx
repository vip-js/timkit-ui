import { Button } from '@timui/react'
import { ArrowLeftIcon } from 'lucide-react'

export default function Component() {
  return (
    <Button className="group" variant="ghost">
      <ArrowLeftIcon
        className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
        size={16}
        aria-hidden="true"
      />
      Button
    </Button>
  )
}
