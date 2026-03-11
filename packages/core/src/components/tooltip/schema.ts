import { defineUCS } from '../../shared'

const tooltipSchema = defineUCS({
  name: 'tooltip',
  title: 'Tooltip',
  description:
    'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  parts: [
    { name: 'root', description: 'The tooltip container', isRoot: true },
    { name: 'trigger', description: 'The triggering element' },
    { name: 'content', description: 'The tooltip content' },
  ],
  logic: {
    provider: 'zag',
    machine: 'tooltip',
  },
  props: [
    {
      name: 'open',
      type: 'boolean',
      description: 'The controlled open state.',
    },
    {
      name: 'onOpenChange',
      type: 'event',
      description: 'Event handler called when the open state changes.',
    },
    {
      name: 'delayDuration',
      type: 'number',
      description:
        'The duration from when the mouse hovers over the trigger until the tooltip opens.',
      defaultValue: 700,
    },
  ],
  slots: [{ name: 'default', description: 'The tooltip items' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default tooltipSchema
