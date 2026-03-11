import { defineUCS } from '../../shared'

const dialogSchema = defineUCS({
  name: 'dialog',
  title: 'Dialog',
  description:
    'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
  parts: [
    { name: 'root', description: 'The dialog container', isRoot: true },
    { name: 'trigger', description: 'The toggle button' },
    { name: 'portal', description: 'The portal container' },
    { name: 'overlay', description: 'The dimmed background' },
    { name: 'content', description: 'The dialog content' },
    { name: 'header', description: 'The dialog header' },
    { name: 'footer', description: 'The dialog footer' },
    { name: 'title', description: 'The dialog title' },
    { name: 'description', description: 'The dialog description' },
    { name: 'close', description: 'The close button' },
  ],
  logic: {
    provider: 'zag',
    machine: 'dialog',
  },
  props: [
    {
      name: 'open',
      type: 'boolean',
      description: 'The controlled open state.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      description: 'The default open state.',
    },
    {
      name: 'onOpenChange',
      type: 'event',
      description: 'Event handler called when the open state changes.',
    },
    {
      name: 'modal',
      type: 'boolean',
      description: 'Whether the dialog is modal.',
      defaultValue: true,
    },
  ],
  slots: [{ name: 'default', description: 'The dialog content' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default dialogSchema
