import { defineUCS } from '../../shared'

const resizableSchema = defineUCS({
    name: 'resizable',
    title: 'Resizable',
    description: 'Accessible resizable panel groups and handles.',
    parts: [
        { name: 'root', description: 'The panel group', isRoot: true },
        { name: 'panel', description: 'A single resizable panel' },
        { name: 'handle', description: 'The divider handle' },
    ],
    logic: {
        provider: 'none',
    },
    props: [
        {
            name: 'direction',
            type: 'enum',
            description: 'The resize direction.',
            values: ['horizontal', 'vertical'],
            defaultValue: 'horizontal',
        },
    ],
    slots: [
        { name: 'default', description: 'The panels and handles' },
    ],
    supportedPlatforms: ['web'],
})

export default resizableSchema
