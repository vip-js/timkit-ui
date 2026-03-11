import { defineUCS } from '../../shared'

const notificationSchema = defineUCS({
  name: 'notification',
  title: 'Notification',
  description: 'A brief message about an app process, displayed in a small popup.',
  parts: [
    { name: 'root', description: 'The notification container', isRoot: true },
    { name: 'icon', description: 'The icon section' },
    { name: 'title', description: 'The notification title' },
    { name: 'description', description: 'The notification description' },
    { name: 'actions', description: 'The actions section' },
  ],
  logic: {
    provider: 'none',
  },
  props: [
    {
      name: 'variant',
      type: 'enum',
      description: 'Visual priority level for the notification.',
      values: ['default', 'info', 'success', 'warning', 'destructive'],
      defaultValue: 'default',
    },
    {
      name: 'duration',
      type: 'number',
      description: 'Auto dismiss duration in milliseconds.',
      defaultValue: 5000,
    },
    {
      name: 'closable',
      type: 'boolean',
      description: 'Whether users can manually close the notification.',
      defaultValue: true,
    },
    {
      name: 'onClose',
      type: 'event',
      description: 'Callback fired when the notification closes.',
    },
  ],
  slots: [{ name: 'default', description: 'The notification segments' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default notificationSchema
