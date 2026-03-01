import { defineUCS } from '../../shared'

const collapsibleSchema = defineUCS({
    name: 'collapsible',
    title: 'Collapsible',
    description: 'An interactive component which can be expanded or collapsed.',
    parts: [
        { name: 'root', description: 'The collapsible container', isRoot: true },
        { name: 'trigger', description: 'The toggle button' },
        { name: 'content', description: 'The collapsible content' },
    ],
    logic: {
        provider: 'zag',
        machine: 'collapsible',
    },
    props: [
        {
            name: 'open',
            type: 'boolean',
            description: 'The controlled open state.',
        },
        {
            name: 'defaultOpen',
            type: 'boolean',
            description: 'The default open state.',
        },
        {
            name: 'onOpenChange',
            type: 'event',
            description: 'Event handler called when the open state changes.',
        },
        {
            name: 'disabled',
            type: 'boolean',
            description: 'Whether the collapsible is disabled.',
            defaultValue: false,
        },
    ],
    slots: [
        { name: 'default', description: 'The content and trigger' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default collapsibleSchema
