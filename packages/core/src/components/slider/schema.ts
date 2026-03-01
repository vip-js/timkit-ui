import { defineUCS } from '../../shared'

const sliderSchema = defineUCS({
    name: 'slider',
    title: 'Slider',
    description: 'An input where the user selects a value from a given range.',
    parts: [
        { name: 'root', description: 'The slider container', isRoot: true },
        { name: 'track', description: 'The slider track' },
        { name: 'range', description: 'The filled part of the track' },
        { name: 'thumb', description: 'The handler to slide' },
    ],
    logic: {
        provider: 'zag',
        machine: 'slider',
    },
    props: [
        {
            name: 'value',
            type: 'number',
            description: 'The controlled value.',
        },
        {
            name: 'min',
            type: 'number',
            description: 'The minimum value.',
            defaultValue: 0,
        },
        {
            name: 'max',
            type: 'number',
            description: 'The maximum value.',
            defaultValue: 100,
        },
        {
            name: 'step',
            type: 'number',
            description: 'The step value.',
            defaultValue: 1,
        },
        {
            name: 'onValueChange',
            type: 'event',
            description: 'Callback called when value changes.',
        },
        {
            name: 'disabled',
            type: 'boolean',
            description: 'Whether the slider is disabled.',
            defaultValue: false,
        },
    ],
    slots: [],
    supportedPlatforms: ['web', 'wechat'],
})

export default sliderSchema
