import { useId } from 'react'
import {
  AccordionTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@timui/react'

export default function Component() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Select with left text</Label>
      <Select defaultValue="1">
        <SelectTrigger id={id}>
          <span>
            Language: <SelectValue placeholder="Select a language" />
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Javascript</SelectItem>
          <SelectItem value="2">Bash</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
