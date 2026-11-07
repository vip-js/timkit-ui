import { Badge } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return <Badge onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks}>Badge</Badge>
}
