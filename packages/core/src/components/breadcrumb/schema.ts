import { defineUCS } from '../../shared'

const breadcrumbSchema = defineUCS({
  name: 'breadcrumb',
  title: 'Breadcrumb',
  description: "A navigation trail that shows the current page's location within a hierarchy.",
  parts: [
    { name: 'root', description: 'The breadcrumb container', isRoot: true },
    { name: 'list', description: 'The list of items' },
    { name: 'item', description: 'A single item' },
    { name: 'link', description: 'A link item' },
    { name: 'page', description: 'The current page item' },
    { name: 'separator', description: 'The separator between items' },
    { name: 'ellipsis', description: 'The ellipsis item' },
  ],
  logic: {
    provider: 'none',
  },
  props: [],
  slots: [{ name: 'default', description: 'The breadcrumb items' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default breadcrumbSchema
