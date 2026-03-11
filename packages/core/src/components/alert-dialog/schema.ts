import { defineUCS } from '../../shared'

const alertDialogSchema = defineUCS({
  name: 'alert-dialog',
  title: 'Alert Dialog',
  description:
    'A modal dialog that interrupts the user with important content and expects a response.',
  parts: [
    { name: 'root', description: 'The alert dialog container', isRoot: true },
    { name: 'trigger', description: 'The button that opens the dialog' },
    { name: 'portal', description: 'The portal to render content outside the DOM' },
    { name: 'overlay', description: 'The backdrop element' },
    { name: 'content', description: 'The dialog content' },
    { name: 'header', description: 'The dialog header' },
    { name: 'footer', description: 'The dialog footer' },
    { name: 'title', description: 'The dialog title' },
    { name: 'description', description: 'The dialog description' },
    { name: 'action', description: 'The primary confirmation button' },
    { name: 'cancel', description: 'The cancellation button' },
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
      name: 'onOpenChange',
      type: 'event',
      description: 'Event handler called when open state changes.',
    },
  ],
  slots: [{ name: 'default', description: 'The dialog content segments' }],
  supportedPlatforms: ['web'],
})

export default alertDialogSchema
