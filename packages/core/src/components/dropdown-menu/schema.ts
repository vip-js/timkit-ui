import { defineUCS } from '../../shared'

const dropdownMenuSchema = defineUCS({
  name: 'dropdown-menu',
  title: 'Dropdown Menu',
  description:
    'Displays a menu to the user—such as a set of actions or functions—triggered by a button.',
  parts: [
    { name: 'root', description: 'The dropdown container', isRoot: true },
    { name: 'trigger', description: 'The toggle button' },
    { name: 'content', description: 'The menu dropdown' },
    { name: 'item', description: 'A standard menu item' },
    { name: 'checkboxItem', description: 'A menu item with a checkbox' },
    { name: 'radioItem', description: 'A menu item in a radio group' },
    { name: 'radioGroup', description: 'A group for radio items' },
    { name: 'group', description: 'A group of menu items' },
    { name: 'label', description: 'A group label' },
    { name: 'separator', description: 'A separator line' },
    { name: 'shortcut', description: 'A keyboard shortcut hint' },
    { name: 'sub', description: 'A submenu container' },
    { name: 'subTrigger', description: 'A button to trigger a submenu' },
    { name: 'subContent', description: 'The submenu dropdown' },
  ],
  logic: {
    provider: 'zag',
    machine: 'menu',
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
  ],
  slots: [{ name: 'default', description: 'The dropdown segments' }],
  supportedPlatforms: ['web', 'wechat'],
})

export default dropdownMenuSchema
