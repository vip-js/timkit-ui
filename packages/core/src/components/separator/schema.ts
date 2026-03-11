import { defineUCS } from '../../shared'

const separatorSchema = defineUCS({
  name: 'separator',
  title: 'Separator',
  description: 'Visually or semantically separates content.',
  parts: [{ name: 'root', description: 'The separator element', isRoot: true }],
  logic: {
    provider: 'none',
  },
  props: [
    {
      name: 'orientation',
      type: 'enum',
      description: 'The orientation of the separator.',
      values: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    {
      name: 'decorative',
      type: 'boolean',
      description: 'Whether the separator is purely decorative.',
      defaultValue: true,
    },
  ],
  slots: [],
  supportedPlatforms: ['web', 'wechat'],
})

export default separatorSchema
