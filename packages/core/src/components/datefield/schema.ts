import { defineUCS } from '../../shared'

const datefieldSchema = defineUCS({
  name: 'datefield',
  title: 'Datefield',
  description: 'A specialized input for entering and editing date and time values.',
  parts: [
    { name: 'root', description: 'The datefield container', isRoot: true },
    { name: 'input', description: 'The segment container' },
    { name: 'segment', description: 'An individual date/time segment' },
  ],
  logic: {
    provider: 'zag',
    machine: 'date-picker',
  },
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'The controlled date value.',
    },
    {
      name: 'onValueChange',
      type: 'event',
      description: 'Event handler called when the value changes.',
    },
  ],
  slots: [],
  supportedPlatforms: ['web'],
})

export default datefieldSchema
