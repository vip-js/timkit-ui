'use client'

import { CodeBracketIcon, TvIcon } from '@heroicons/react/24/outline'
import { Button } from '@timui/react'

type Props = {
  preview: boolean
  setPreview: (type: boolean) => void
}

const SwitchBtn = ({ preview, setPreview }: Props) => (
  <Button
    onClick={() => setPreview(!preview)}
    className="flex items-center gap-x-3 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-sm font-semibold text-foreground shadow-[0_10px_24px_-18px_rgba(15,23,42,0.3)] transition hover:-translate-y-0.5 hover:border-foreground/30"
  >
    Code
    {preview ? <CodeBracketIcon className="h-5 w-5" /> : <TvIcon className="h-5 w-5" />}
  </Button>
)

const PreviewSwitch = ({ preview, setPreview }: Props) => {
  return (
    <div className="text-sm">
      <SwitchBtn preview={preview} setPreview={setPreview} />
    </div>
  )
}

export default PreviewSwitch
