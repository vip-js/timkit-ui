import { defineUCS } from '../../shared'

const hoverCardSchema = defineUCS({
    name: 'hover-card',
    title: 'Hover Card',
    description: 'For sighted users to preview content available behind a link.',
    parts: [
        { name: 'root', description: 'The hover card container', isRoot: true },
        { name: 'trigger', description: 'The triggering link/button' },
        { name: 'content', description: 'The preview content' },
    ],
    logic: {
        provider: 'zag',
        machine: 'hoverCard',
    },
    props: [
        {
            name: 'open',
            type: 'boolean',
            description: 'The controlled open state.',
        },
        {
            name: 'onOpenChange',
            type: 'event',
            description: 'Event handler called when the open state changes.',
        },
        {
            name: 'openDelay',
            type: 'number',
            description: 'The delay before opening when hovering.',
            defaultValue: 700,
        },
        {
            name: 'closeDelay',
            type: 'number',
            description: 'The delay before closing when leaving.',
            defaultValue: 300,
        }
    ],
    slots: [
        { name: 'default', description: 'The hover card segments' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default hoverCardSchema
