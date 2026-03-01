import { useId, useState } from 'react'
import { AccordionTrigger, Label } from '@timui/react'

import {
  TagsInput,
  TagsInputClearTrigger,
  TagsInputControl,
  TagsInputInput,
  TagsInputItem,
} from '../ui/tags-input'

const defaultTags = ['Sport', 'Coding', 'Travel']

export default function Component() {
  const id = useId()
  const [value, setValue] = useState(defaultTags)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Input with tags</Label>
      <TagsInput value={value} onValueChange={(details) => setValue(details.value)}>
        <TagsInputControl>
          {value.map((tag, index) => (
            <TagsInputItem key={index} index={index} value={tag} />
          ))}
          <TagsInputInput placeholder="Add a tag" />
        </TagsInputControl>
        <TagsInputClearTrigger />
      </TagsInput>
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with <span className="text-foreground">TimUI TagsInput</span>
      </p>
    </div>
  )
}
