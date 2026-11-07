import { RiFacebookFill, RiGithubFill, RiGoogleFill, RiTwitterXFill } from '@remixicon/react'
import { Button } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="inline-flex flex-wrap gap-2">
      <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline" aria-label="Login with Google" size="icon">
        <RiGoogleFill size={16} aria-hidden="true" />
      </Button>
      <Button variant="outline" aria-label="Login with Facebook" size="icon">
        <RiFacebookFill size={16} aria-hidden="true" />
      </Button>
      <Button variant="outline" aria-label="Login with X" size="icon">
        <RiTwitterXFill size={16} aria-hidden="true" />
      </Button>
      <Button variant="outline" aria-label="Login with GitHub" size="icon">
        <RiGithubFill size={16} aria-hidden="true" />
      </Button>
    </div>
  )
}
