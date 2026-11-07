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
      description: 'The controlled checked state. The value indeterminate is announced as mixed.',
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
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'When true, checked changes are ignored.',
      defaultValue: false,
    },
    {
      name: 'required',
      type: 'boolean',
      description: 'When true, the checkbox is announced as required.',
      defaultValue: false,
    },
  ],
  slots: [{ name: 'default', description: 'The content of the checkbox' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default checkboxSchema
