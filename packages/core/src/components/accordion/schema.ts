import { defineUCS } from '../../shared'

const accordionSchema = defineUCS({
  name: 'accordion',
  title: 'Accordion',
  description:
    'A vertically stacked set of interactive headings that each reveal a section of content.',
  parts: [
    { name: 'root', description: 'The accordion container', isRoot: true },
    { name: 'item', description: 'An accordion item' },
    { name: 'trigger', description: 'The toggle button for an item' },
    { name: 'content', description: 'The collapsible content section' },
  ],
  logic: {
    provider: 'zag',
    machine: 'accordion',
  },
  props: [
    {
      name: 'type',
      type: 'enum',
      description: 'The selection mode of the accordion.',
      values: ['single', 'multiple'],
      defaultValue: 'single',
    },
    {
      name: 'collapsible',
      type: 'boolean',
      description: 'Whether a single accordion item can be collapsed after it has been opened.',
      defaultValue: false,
    },
    {
      name: 'value',
      type: 'string',
      description: 'The controlled value of the accordion items to expand.',
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Event handler called when the value changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Whether the accordion is disabled.',
      defaultValue: false,
    },
  ],
  slots: [{ name: 'default', description: 'The accordion items' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default accordionSchema
