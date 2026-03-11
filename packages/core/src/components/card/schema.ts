import { defineUCS } from '../../shared'

const cardSchema = defineUCS({
  name: 'card',
  title: 'Card',
  description: 'A container that displays content in a box with a header, body, and footer.',
  parts: [
    { name: 'root', description: 'The card container', isRoot: true },
    { name: 'header', description: 'The card header' },
    { name: 'title', description: 'The card title' },
    { name: 'description', description: 'The card description' },
    { name: 'content', description: 'The card content' },
    { name: 'footer', description: 'The card footer' },
  ],
  logic: {
    provider: 'none',
  },
  props: [],
  slots: [{ name: 'default', description: 'The card segments' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default cardSchema
