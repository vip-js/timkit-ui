import { RiFacebookFill, RiGithubFill, RiGoogleFill, RiTwitterXFill } from '@remixicon/react'
import { Button } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline">
        <RiGoogleFill
          className="me-1 text-[#DB4437] dark:text-white/60"
          size={16}
          aria-hidden="true"
        />
        Login with Google
      </Button>
      <Button variant="outline">
        <RiTwitterXFill
          className="me-1 text-[#14171a] dark:text-white/60"
          size={16}
          aria-hidden="true"
        />
        Login with X
      </Button>
      <Button variant="outline">
        <RiFacebookFill
          className="me-1 text-[#1877f2] dark:text-white/60"
          size={16}
          aria-hidden="true"
        />
        Login with Facebook
      </Button>
      <Button variant="outline">
        <RiGithubFill
          className="me-1 text-[#333333] dark:text-white/60"
          size={16}
          aria-hidden="true"
        />
        Login with GitHub
      </Button>
    </div>
  )
}
