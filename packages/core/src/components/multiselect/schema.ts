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
    {
      name: 'open',
      type: 'boolean',
      description: 'The controlled open state of the list.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      description: 'The default open state of the list when uncontrolled.',
    },
    {
      name: 'onOpenChange',
      type: 'event',
      description: 'Event handler called when the list open state changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'When true, opening and selection are ignored.',
      defaultValue: false,
    },
  ],
  slots: [{ name: 'default', description: 'The multiselect core components' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default multiselectSchema
