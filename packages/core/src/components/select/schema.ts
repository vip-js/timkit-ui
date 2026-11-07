import { defineUCS } from '../../shared'

const selectSchema = defineUCS({
  name: 'select',
  title: 'Select',
  description: 'Displays a list of options for the user to pick from—triggered by a button.',
  parts: [
    { name: 'root', description: 'The select container', isRoot: true },
    { name: 'trigger', description: 'The toggle button' },
    { name: 'value', description: 'The display value' },
    { name: 'content', description: 'The dropdown content' },
    { name: 'item', description: 'A single option' },
    { name: 'group', description: 'A group of options' },
    { name: 'label', description: 'A group label' },
    { name: 'separator', description: 'A separator line' },
  ],
  logic: {
    provider: 'zag',
    machine: 'select',
  },
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'The controlled value.',
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Event handler called when the value changes.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'The placeholder text.',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'The controlled open state of the list.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      description: 'The default open state of the list when uncontrolled.',
    },
    {
      name: 'onOpenChange',
      type: 'event',
      description: 'Event handler called when the list open state changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'When true, opening and selection are ignored.',
      defaultValue: false,
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'When true, opening and selection are ignored.',
      defaultValue: false,
    },
    {
      name: 'required',
      type: 'boolean',
      description: 'When true, the select is announced as required.',
      defaultValue: false,
    },
  ],
  slots: [{ name: 'default', description: 'The select segments' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default selectSchema
