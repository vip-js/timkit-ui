"use client"

import { CodeBracketIcon, TvIcon } from "@heroicons/react/24/outline"

import { Button } from "../ui/button"

type Props = {
  preview: boolean
  setPreview: (type: boolean) => void
}

const SwitchBtn = ({ preview, setPreview }: Props) => (
  <Button
    onClick={() => setPreview(!preview)}
    className="flex w-25 gap-x-3 rounded-lg bg-zinc-800 py-2 text-sm text-zinc-50 shadow-sm hover:bg-zinc-700"
  >
    Code
    {preview ? (
      <CodeBracketIcon className="h-5 w-5" />
    ) : (
      <TvIcon className="h-5 w-5" />
    )}
  </Button>
)

export default ({ preview, setPreview }: Props) => {
  return (
    <div className="text-sm">
      <SwitchBtn preview={preview} setPreview={setPreview} />
    </div>
  )
}
