import { defineUCS } from '../../shared'

const alertSchema = defineUCS({
  name: 'alert',
  title: 'Alert',
  description: 'Displays a callout for user attention.',
  parts: [
    { name: 'root', description: 'The alert container', isRoot: true },
    { name: 'title', description: 'The alert title' },
    { name: 'description', description: 'The alert description' },
  ],
  logic: {
    provider: 'none',
  },
  props: [
    {
      name: 'variant',
      type: 'enum',
      description: 'The visual style of the alert.',
      values: ['default', 'destructive'],
      defaultValue: 'default',
    },
  ],
  slots: [{ name: 'default', description: 'The alert content' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default alertSchema
