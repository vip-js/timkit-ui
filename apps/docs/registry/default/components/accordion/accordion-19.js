Component({
  data: {
    value: "3",
    items: [
  {
    "id": "1",
    "title": "What makes Timkit UI different?",
    "collapsibles": [
      {
        "title": "What about performance?",
        "content": "We optimize every component for maximum performance and minimal bundle size."
      },
      {
        "title": "How is the documentation?",
        "content": "Our documentation is comprehensive and includes live examples for every component."
      }
    ]
  },
  {
    "id": "2",
    "title": "How can I customize the components?",
    "collapsibles": [
      {
        "title": "Can I use custom themes?",
        "content": "Yes, our theming system is fully customizable and supports both light and dark modes."
      },
      {
        "title": "What about Tailwind support?",
        "content": "We have first-class support for Tailwind CSS with custom utility classes."
      }
    ]
  },
  {
    "id": "3",
    "title": "Is Timkit UI optimized for performance?",
    "collapsibles": [
      {
        "title": "What's the bundle size impact?",
        "content": "Our components are tree-shakeable and typically add minimal overhead to your bundle.",
        "open": true
      },
      {
        "title": "How is code splitting handled?",
        "content": "We support automatic code splitting for optimal loading performance."
      }
    ]
  },
  {
    "id": "4",
    "title": "How accessible are the components?",
    "collapsibles": [
      {
        "title": "Which screen readers are supported?",
        "content": "We test with NVDA, VoiceOver, and JAWS to ensure broad compatibility."
      },
      {
        "title": "What about keyboard navigation?",
        "content": "Full keyboard navigation support is implemented following WAI-ARIA best practices."
      }
    ]
  }
]
  },
  methods: {
    handleValueChange(e) {
      this.setData({ value: e.detail.value })
    },
    toggleCollapsible(e) {
      const itemIndex = e.currentTarget.dataset.itemIndex
      const collapsibleIndex = e.currentTarget.dataset.collapsibleIndex
      const items = this.data.items.slice()
      const collapsible = items[itemIndex]?.collapsibles?.[collapsibleIndex]
      if (!collapsible) return
      collapsible.open = !collapsible.open
      this.setData({ items })
    }
  }
})