import type { ComponentSchema } from './index'

const navigationMenuSchema: ComponentSchema = {
  name: 'navigation-menu',
  title: 'Navigation Menu',
  description: 'A collection of links for navigating websites.',
  props: [],
  slots: [
    {
      name: 'default',
      description: 'The content of the navigation menu.',
      required: true,
    },
  ],
  variants: [
    {
      name: 'triggerStyle',
      prop: 'className', // It's usually applied via a helper function, but we can document it
      description: 'Style of the navigation menu trigger.',
      options: [
        {
          name: 'default',
          description: 'Default trigger style.',
        },
      ],
    },
  ],
  supportedPlatforms: ['web'],
}

export default navigationMenuSchema
