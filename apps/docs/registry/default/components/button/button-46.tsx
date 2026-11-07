import { RiFacebookFill, RiGithubFill, RiGoogleFill, RiTwitterXFill } from '@remixicon/react'
import { Button } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} className="flex-1" variant="outline" aria-label="Login with Google" size="icon">
        <RiGoogleFill className="dark:text-primary text-[#DB4437]" size={16} aria-hidden="true" />
      </Button>
      <Button className="flex-1" variant="outline" aria-label="Login with Facebook" size="icon">
        <RiFacebookFill className="dark:text-primary text-[#1877f2]" size={16} aria-hidden="true" />
      </Button>
      <Button className="flex-1" variant="outline" aria-label="Login with X" size="icon">
        <RiTwitterXFill className="dark:text-primary text-[#14171a]" size={16} aria-hidden="true" />
      </Button>
      <Button className="flex-1" variant="outline" aria-label="Login with GitHub" size="icon">
        <RiGithubFill className="dark:text-primary text-black" size={16} aria-hidden="true" />
      </Button>
    </div>
  )
}
