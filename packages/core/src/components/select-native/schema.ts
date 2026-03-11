import { defineUCS } from '../../shared'

const selectNativeSchema = defineUCS({
  name: 'select-native',
  title: 'Select Native',
  description: 'A native HTML select element styled with a custom wrapper.',
  parts: [
    { name: 'root', description: 'The select wrapper', isRoot: true },
    { name: 'select', description: 'The native select element' },
  ],
  logic: {
    provider: 'none',
  },
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'The value of the select. Use string[] when multiple is true.',
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Event handler called when the value changes.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      description: 'Whether multiple options can be selected.',
      defaultValue: false,
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'The initial value of the select. Use string[] when multiple is true.',
    },
  ],
  slots: [{ name: 'default', description: 'The option elements' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default selectNativeSchema
