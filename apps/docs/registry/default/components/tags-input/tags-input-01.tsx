'use client'

import { useState } from 'react'
import { TagsInput, TagsInputControl, TagsInputInput, TagsInputItem } from '@timui/react'

export default function Component() {
  const [value, setValue] = useState(['design'])
  return (
    <TagsInput id="tags" className="w-72" value={value} onValueChange={(event) => setValue(event.detail.value)}>
      <TagsInputControl>
        {value.map((item, index) => (
          <TagsInputItem key={item} index={index} value={item}>{item}</TagsInputItem>
        ))}
        <TagsInputInput className="min-w-16" placeholder="Add a tag" />
      </TagsInputControl>
    </TagsInput>
  )
}
