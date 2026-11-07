import { defineUCS } from '../../shared'

const bannerSchema = defineUCS({
  name: 'banner',
  title: 'Banner',
  description: 'A prominent message displayed at the top or bottom of a view.',
  parts: [
    { name: 'root', description: 'The banner container', isRoot: true },
    { name: 'content', description: 'The content wrapper' },
    { name: 'icon', description: 'The icon section' },
    { name: 'title', description: 'The banner title' },
    { name: 'description', description: 'The banner description' },
    { name: 'actions', description: 'The actions section' },
  ],
  logic: {
    provider: 'none',
  },
  props: [
    {
      name: 'variant',
      type: 'enum',
      description: 'Visual style of the banner message.',
      values: ['default', 'success', 'warning', 'destructive'],
      defaultValue: 'default',
    },
    {
      name: 'dismissible',
      type: 'boolean',
      description: 'Whether the banner can be dismissed by the user.',
      defaultValue: false,
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'The controlled open state of the banner.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      description: 'The default open state of the banner when uncontrolled.',
      defaultValue: true,
    },
    {
      name: 'onOpenChange',
      type: 'event',
      description: 'Event handler called when the banner open state changes.',
    },
    {
      name: 'onClose',
      type: 'event',
      description: 'Callback fired when the banner is dismissed.',
    },
  ],
  slots: [{ name: 'default', description: 'The banner segments' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default bannerSchema
