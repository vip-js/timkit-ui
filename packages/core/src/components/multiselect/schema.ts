import { defineUCS } from '../../shared'

const multiselectSchema = defineUCS({
  name: 'multiselect',
  title: 'Multiselect',
  description:
    'A component used to select multiple options from a list, often with searching and tagging capabilities.',
  parts: [
    { name: 'root', description: 'The multiselect container', isRoot: true },
    { name: 'trigger', description: 'The input trigger wrapper' },
    { name: 'input', description: 'The search input' },
    { name: 'list', description: 'The results dropdown' },
    { name: 'item', description: 'A single result option' },
    { name: 'badge', description: 'A selected option badge' },
  ],
  logic: {
    provider: 'none',
  },
  props: [
    {
      name: 'value',
      type: 'array',
      description: 'The selected values.',
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Event handler called when the value changes.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'The input placeholder.',
    },
  ],
  slots: [{ name: 'default', description: 'The multiselect core components' }],
  supportedPlatforms: ['web'],
})

export default multiselectSchema
