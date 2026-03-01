import { defineUCS } from '../../shared'

const scrollAreaSchema = defineUCS({
    name: 'scroll-area',
    title: 'Scroll Area',
    description: 'Adds custom scrollbars to an area of content.',
    parts: [
        { name: 'root', description: 'The scroll area container', isRoot: true },
        { name: 'viewport', description: 'The scrollable viewport' },
        { name: 'scrollbar', description: 'The scrollbar element' },
    ],
    logic: {
        provider: 'none',
    },
    props: [
        {
            name: 'orientation',
            type: 'enum',
            description: 'The scroll orientation.',
            values: ['horizontal', 'vertical', 'both'],
            defaultValue: 'vertical',
        },
    ],
    slots: [
        { name: 'default', description: 'The scrollable content' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default scrollAreaSchema
