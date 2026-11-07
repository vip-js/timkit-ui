import { defineUCS } from '../../shared'

const treeSchema = defineUCS({
  name: 'tree',
  title: 'Tree',
  description: 'A component used to display hierarchical data.',
  parts: [
    { name: 'root', description: 'The tree container', isRoot: true },
    { name: 'item', description: 'A tree node' },
    { name: 'label', description: 'A node label' },
    { name: 'dragLine', description: 'The drag indicator' },
  ],
  logic: {
    provider: 'none',
  },
  props: [
    {
      name: 'data',
      type: 'array',
      description: 'The structured array of data used to render the component.',
    },
    {
      name: 'indent',
      type: 'number',
      description: 'The indentation for children.',
      defaultValue: 20,
    },
    {
      name: 'tree',
      type: 'object',
      description: 'The node tree or hierarchical data structure.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'When true, expanding and selecting are ignored.',
      defaultValue: false,
    },
    {
      name: 'selected',
      type: 'string',
      description: 'The controlled id of the selected node.',
    },
    {
      name: 'onSelectedChange',
      type: 'event',
      description:
        'Event handler called with the next selected id. A controlled selected value stays until the parent applies it.',
    },
  ],
  slots: [{ name: 'default', description: 'The tree items' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default treeSchema
