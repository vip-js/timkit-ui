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
            name: 'indent',
            type: 'number',
            description: 'The indentation for children.',
            defaultValue: 20,
        },
    ],
    slots: [
        { name: 'default', description: 'The tree items' },
    ],
    supportedPlatforms: ['web'],
})

export default treeSchema
