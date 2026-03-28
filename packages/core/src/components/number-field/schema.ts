import { defineUCS } from '../../shared'

const numberFieldSchema = defineUCS({
  name: 'number-field',
  title: 'Number Field',
  description: 'A numeric input with increment and decrement controls.',
  parts: [
    { name: 'root', description: 'The number field container', isRoot: true },
    { name: 'control', description: 'The control wrapper around input and triggers' },
    { name: 'input', description: 'The numeric input element' },
    { name: 'increment-trigger', description: 'The increment trigger button' },
    { name: 'decrement-trigger', description: 'The decrement trigger button' },
  ],
  logic: {
    provider: 'zag',
    machine: 'number-input',
  },
  props: [
    {
      name: 'value',
      type: 'number',
      description: 'The controlled numeric value.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      description: 'The initial value when uncontrolled.',
    },
    {
      name: 'min',
      type: 'number',
      description: 'The minimum allowed value.',
    },
    {
      name: 'max',
      type: 'number',
      description: 'The maximum allowed value.',
    },
    {
      name: 'step',
      type: 'number',
      description: 'The amount by which to increment or decrement.',
      defaultValue: 1,
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Event handler called when the value changes.',
    },
  ],
  slots: [{ name: 'default', description: 'Custom number-field structure' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default numberFieldSchema
