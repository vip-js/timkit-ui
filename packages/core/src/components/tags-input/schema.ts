import { defineUCS } from '../../shared'

const tagsInputSchema = defineUCS({
  name: 'tags-input',
  title: 'Tags Input',
  description: 'An input that allows users to enter multiple tags as discrete elements.',
  parts: [
    { name: 'root', description: 'The tags input container', isRoot: true },
    { name: 'control', description: 'The input control wrapper' },
    { name: 'input', description: 'The text input' },
    { name: 'item', description: 'A tag item' },
    { name: 'clearTrigger', description: 'The clear all button' },
  ],
  logic: {
    provider: 'zag',
    machine: 'tagsInput',
  },
  props: [
    {
      name: 'value',
      type: 'array',
      description: 'The tags value.',
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Event handler called when tags change.',
    },
  ],
  slots: [{ name: 'default', description: 'The tags input segments' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default tagsInputSchema
