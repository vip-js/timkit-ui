import { defineUCS } from '../../shared'

const datefieldSchema = defineUCS({
  name: 'datefield',
  title: 'Datefield',
  description:
    'The date-field contract. date-field and datefield-rac are aliases of this schema. Calendar and date-picker stay separate contracts.',
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
    {
      name: 'disabled',
      type: 'boolean',
      description: 'When true, date changes are ignored.',
      defaultValue: false,
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'When true, the field stays focusable and date changes are ignored.',
      defaultValue: false,
    },
  ],
  slots: [],
  supportedPlatforms: ['web', 'wechat'],
})

export default datefieldSchema
