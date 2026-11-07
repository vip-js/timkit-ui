import { Cropper, CropperCropArea, CropperDescription, CropperImage } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="flex flex-col items-center gap-2">
      <Cropper onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks}
        className="h-80"
        minZoom={2}
        maxZoom={10}
        image="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/cropper-08_wneftq.jpg"
      >
        <CropperDescription />
        <CropperImage />
        <CropperCropArea />
      </Cropper>

      <p aria-live="polite" role="region" className="text-muted-foreground mt-2 text-xs">
        Cropper with custom zoom limits ∙{' '}
        <a
          href="https://github.com/origin-space/image-cropper"
          className="hover:text-foreground underline"
          target="_blank"
        >
          API
        </a>
      </p>
    </div>
  )
}
