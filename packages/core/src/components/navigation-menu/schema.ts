import { defineUCS } from '../../shared'

const navigationMenuSchema = defineUCS({
  name: 'navigation-menu',
  title: 'Navigation Menu',
  description: 'A collection of links for navigating websites.',
  parts: [
    { name: 'root', description: 'The navigation menu root', isRoot: true },
    { name: 'list', description: 'The list of menu items' },
    { name: 'item', description: 'A menu item' },
    { name: 'trigger', description: 'The trigger for a menu item' },
    { name: 'content', description: 'The content for a menu item' },
    { name: 'link', description: 'A link in a menu item' },
  ],
  logic: {
    provider: 'none',
  },
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'Value of the open menu item.',
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Called when the open item changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'When true, opening a menu item is ignored.',
      defaultValue: false,
    },
  ],
  slots: [
    {
      name: 'default',
      description: 'The content of the navigation menu.',
      required: true,
    },
  ],
  variants: [
    {
      name: 'triggerStyle',
      prop: 'className',
      description: 'Style of the navigation menu trigger.',
      options: [
        {
          name: 'default',
          description: 'Default trigger style.',
        },
      ],
    },
  ],
  supportedPlatforms: ['web', 'wechat'],
})

export default navigationMenuSchema
