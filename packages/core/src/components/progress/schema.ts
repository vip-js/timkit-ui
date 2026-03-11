import { defineUCS } from '../../shared'

const progressSchema = defineUCS({
  name: 'progress',
  title: 'Progress',
  description: 'An indicator showing the completion progress of a task.',
  parts: [
    { name: 'root', description: 'The progress bar container', isRoot: true },
    { name: 'indicator', description: 'The progress indicator' },
  ],
  logic: {
    provider: 'zag',
    machine: 'progress',
  },
  props: [
    {
      name: 'value',
      type: 'number',
      description: 'The current progress value.',
    },
    {
      name: 'max',
      type: 'number',
      description: 'The maximum progress value.',
      defaultValue: 100,
    },
  ],
  slots: [],
  supportedPlatforms: ['web', 'wechat'],
})

export default progressSchema
