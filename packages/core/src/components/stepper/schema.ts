import { defineUCS } from '../../shared'

const stepperSchema = defineUCS({
  name: 'stepper',
  title: 'Stepper',
  description: 'A component used to display progress through a sequence of steps.',
  parts: [
    { name: 'root', description: 'The stepper container', isRoot: true },
    { name: 'item', description: 'A single step' },
    { name: 'trigger', description: 'The step selector' },
    { name: 'indicator', description: 'The step number/icon' },
    { name: 'separator', description: 'The line between steps' },
    { name: 'title', description: 'The step title' },
    { name: 'description', description: 'The step description' },
  ],
  logic: {
    provider: 'zag',
    machine: 'number-input',
  },
  props: [
    {
      name: 'value',
      type: 'number',
      description: 'The active step index.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      description: 'The initial active step index.',
      defaultValue: 0,
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Event handler called when active step changes.',
    },
    {
      name: 'orientation',
      type: 'enum',
      description: 'The orientation of the stepper.',
      values: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
  ],
  slots: [{ name: 'default', description: 'The stepper items' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default stepperSchema
