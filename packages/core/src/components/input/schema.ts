import { defineUCS } from '../../shared'

const inputSchema = defineUCS({
  name: 'input',
  title: 'Input',
  description: 'A basic text input component.',
  parts: [{ name: 'root', description: 'The input element itself', isRoot: true }],
  logic: {
    provider: 'none',
  },
  props: [
    {
      name: 'type',
      type: 'string',
      description: 'The type of input element. Password masks the text. Number uses the number keyboard on the mini program.',
      defaultValue: 'text',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'The placeholder text.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'When true, value changes are ignored.',
      defaultValue: false,
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Whether the input is disabled.',
      defaultValue: false,
    },
    {
      name: 'required',
      type: 'boolean',
      description: 'When true, the field is announced as required.',
      defaultValue: false,
    },
    {
      name: 'value',
      type: 'string',
      description: 'The controlled value.',
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Callback called when value changes.',
    },
    {
      name: 'maxLength',
      type: 'number',
      description: 'Typed text longer than this length is cut. An omitted length does not cut the text.',
    },
  ],
  slots: [],
  supportedPlatforms: ['web', 'wechat'],
})

export default inputSchema
