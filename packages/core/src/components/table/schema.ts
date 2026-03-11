import { defineUCS } from '../../shared'

const tableSchema = defineUCS({
  name: 'table',
  title: 'Table',
  description: 'Responsive table components.',
  parts: [
    { name: 'root', description: 'The table container', isRoot: true },
    { name: 'header', description: 'The table header (thead)' },
    { name: 'body', description: 'The table body (tbody)' },
    { name: 'footer', description: 'The table footer (tfoot)' },
    { name: 'row', description: 'A table row (tr)' },
    { name: 'head', description: 'A table header cell (th)' },
    { name: 'cell', description: 'A table body cell (td)' },
    { name: 'caption', description: 'The table caption' },
  ],
  logic: {
    provider: 'none',
  },
  props: [],
  slots: [{ name: 'default', description: 'The table segments' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default tableSchema
