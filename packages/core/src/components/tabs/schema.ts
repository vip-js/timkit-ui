import { defineUCS } from '../../shared'

const tabsSchema = defineUCS({
  name: 'tabs',
  title: 'Tabs',
  description:
    'A set of layered sections of content, known as tab panels, that are displayed one at a time.',
  parts: [
    { name: 'root', description: 'The tabs container', isRoot: true },
    { name: 'list', description: 'The tab list' },
    { name: 'trigger', description: 'The tab trigger' },
    { name: 'content', description: 'The tab content panel' },
  ],
  logic: {
    provider: 'zag',
    machine: 'tabs',
  },
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'The controlled value of the tab to activate.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'The default active tab value.',
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Event handler called when the value changes.',
    },
    {
      name: 'orientation',
      type: 'enum',
      description: 'The orientation of the tabs.',
      values: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
  ],
  slots: [{ name: 'default', description: 'The tabs list and content' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default tabsSchema
