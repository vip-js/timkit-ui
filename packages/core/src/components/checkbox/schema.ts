import { defineUCS } from '../../shared'

const checkboxSchema = defineUCS({
  name: 'checkbox',
  title: 'Checkbox',
  description: 'A control that allows the user to toggle between checked and unchecked states.',
  parts: [
    { name: 'root', description: 'The checkbox container', isRoot: true },
    { name: 'indicator', description: 'The visual indicator of the checked state' },
  ],
  logic: {
    provider: 'zag',
    machine: 'checkbox',
  },
  props: [
    {
      name: 'checked',
      type: 'boolean',
      description: 'The controlled checked state.',
    },
    {
      name: 'onCheckedChange',
      type: 'event',
      description: 'Callback called when checked state changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Whether the checkbox is disabled.',
      defaultValue: false,
    },
  ],
  slots: [{ name: 'default', description: 'The content of the checkbox' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default checkboxSchema
