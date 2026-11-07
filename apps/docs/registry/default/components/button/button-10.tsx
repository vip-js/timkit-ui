import { Button } from '@timui/react'
import { ArrowRightIcon, MailIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} className="group" variant="secondary">
      <MailIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
      Email
      <ArrowRightIcon
        className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
        size={16}
        aria-hidden="true"
      />
    </Button>
  )
}
