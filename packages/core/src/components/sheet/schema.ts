import { defineUCS } from '../../shared'

const sheetSchema = defineUCS({
  name: 'sheet',
  title: 'Sheet',
  description: 'A component that slides in from the edge of the screen like a sidebar.',
  parts: [
    { name: 'root', description: 'The sheet container', isRoot: true },
    { name: 'trigger', description: 'The toggle button' },
    { name: 'portal', description: 'The portal container' },
    { name: 'overlay', description: 'The dimmed background' },
    { name: 'content', description: 'The sheet content' },
    { name: 'header', description: 'The sheet header' },
    { name: 'footer', description: 'The sheet footer' },
    { name: 'title', description: 'The sheet title' },
    { name: 'description', description: 'The sheet description' },
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
      name: 'onOpenChange',
      type: 'event',
      description: 'Event handler called when the open state changes.',
    },
    {
      name: 'side',
      type: 'enum',
      description: 'The side from which the sheet appears.',
      values: ['top', 'bottom', 'left', 'right'],
      defaultValue: 'right',
    },
  ],
  slots: [{ name: 'default', description: 'The sheet content' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default sheetSchema
