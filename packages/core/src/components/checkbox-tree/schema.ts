import { defineUCS } from '../../shared'

const checkboxTreeSchema = defineUCS({
  name: 'checkbox-tree',
  title: 'Checkbox Tree',
  description:
    'A tree component where each node has a checkbox that can be in checked, unchecked, or indeterminate state.',
  parts: [
    { name: 'root', description: 'The tree container', isRoot: true },
    { name: 'node', description: 'A node in the tree' },
  ],
  logic: {
    provider: 'none',
  },
  props: [
    {
      name: 'tree',
      type: 'object',
      description: 'The tree data structure.',
      required: true,
    },
    {
      name: 'renderNode',
      type: 'event',
      description: 'Function to render each node.',
      required: true,
    },
    {
      name: 'checkedKeys',
      type: 'array',
      description: 'The controlled ids of the checked nodes.',
    },
    {
      name: 'onCheckedKeysChange',
      type: 'event',
      description:
        'Event handler called with the next checked ids. A controlled value stays until the parent applies it. Disabled nodes are ignored.',
    },
  ],
  slots: [],
  supportedPlatforms: ['web'],
})

export default checkboxTreeSchema
