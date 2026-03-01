import { defineUCS } from '../../shared'

const timelineSchema = defineUCS({
    name: 'timeline',
    title: 'Timeline',
    description: 'A component used to display a sequence of events in chronological order.',
    parts: [
        { name: 'root', description: 'The timeline container', isRoot: true },
        { name: 'item', description: 'A single event item' },
        { name: 'indicator', description: 'The dot indicator' },
        { name: 'separator', description: 'The line between items' },
        { name: 'content', description: 'The event details' },
        { name: 'title', description: 'The event title' },
        { name: 'date', description: 'The event date' },
    ],
    logic: {
        provider: 'none',
    },
    props: [
        {
            name: 'value',
            type: 'number',
            description: 'The active step in the timeline.',
        },
        {
            name: 'defaultValue',
            type: 'number',
            description: 'The initial active step.',
            defaultValue: 1,
        },
        {
            name: 'onValueChange',
            type: 'event',
            description: 'Event handler called when active step changes.',
        },
        {
            name: 'orientation',
            type: 'enum',
            description: 'The orientation of the timeline.',
            values: ['horizontal', 'vertical'],
            defaultValue: 'vertical',
        }
    ],
    slots: [
        { name: 'default', description: 'The timeline items' },
    ],
    supportedPlatforms: ['web', 'wechat'],
})

export default timelineSchema
