import { useId, useState } from 'react'
import { Label, TagsInput, TagsInputControl, TagsInputInput, TagsInputItem } from '@timui/react'

const defaultTags = ['Red']

export default function Component() {
  const id = useId()
  const [value, setValue] = useState(defaultTags)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Input with inner tags</Label>
      <TagsInput value={value} onValueChange={(details) => setValue(details.value)}>
        <TagsInputControl>
          {value.map((tag, index) => (
            <TagsInputItem key={index} index={index} value={tag} />
          ))}
          <TagsInputInput placeholder="Add a tag" />
        </TagsInputControl>
      </TagsInput>
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with <span className="text-foreground">TimUI TagsInput</span>
      </p>
    </div>
  )
}
