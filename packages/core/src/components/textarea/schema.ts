import { defineUCS } from '../../shared'

const textareaSchema = defineUCS({
  name: 'textarea',
  title: 'Textarea',
  description: 'A multi-line text input component.',
  parts: [{ name: 'root', description: 'The textarea element itself', isRoot: true }],
  logic: {
    provider: 'none',
  },
  props: [
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
      description: 'Whether the textarea is disabled.',
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

export default textareaSchema
