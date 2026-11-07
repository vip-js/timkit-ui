import { defineUCS } from '../../shared/ucs'

export const formSchema = defineUCS({
  name: 'form',
  title: 'Form',
  description: 'A form that validates fields and submits their values.',
  parts: [
    { name: 'root', description: 'The form element', isRoot: true },
    { name: 'field', description: 'One labeled field' },
    { name: 'label', description: 'The field label' },
    { name: 'control', description: 'The field control' },
    { name: 'error', description: 'The field error' },
    { name: 'submit', description: 'The submit button' },
  ],
  logic: { provider: 'native' },
  props: [
    {
      name: 'submitLabel',
      type: 'string',
      description: 'Label for the submit button.',
      defaultValue: 'Submit',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disables every field and the submit button.',
      defaultValue: false,
    },
  ],
  slots: [{ name: 'default', description: 'Fields and the submit button' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default formSchema
