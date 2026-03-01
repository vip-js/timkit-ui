Component({
  data: {
    value: "3",
    items: [
  {
    "id": "1",
    "title": "What makes Timkit UI different?",
    "icon": "CommandIcon",
    "collapsibles": [
      {
        "title": "What about performance?",
        "content": "We optimize every component for maximum performance and minimal bundle size.",
        "icon": "GaugeIcon",
        "iconLabel": "Gauge"
      },
      {
        "title": "How is the documentation?",
        "content": "Our documentation is comprehensive and includes live examples for every component.",
        "icon": "CircleDashedIcon",
        "iconLabel": "Dash"
      }
    ],
    "iconLabel": "Cmd"
  },
  {
    "id": "2",
    "title": "How can I customize the components?",
    "icon": "EclipseIcon",
    "collapsibles": [
      {
        "title": "Can I use custom themes?",
        "content": "Yes, our theming system is fully customizable and supports both light and dark modes.",
        "icon": "GaugeIcon",
        "iconLabel": "Gauge"
      },
      {
        "title": "What about Tailwind support?",
        "content": "We have first-class support for Tailwind CSS with custom utility classes.",
        "icon": "CircleDashedIcon",
        "iconLabel": "Dash"
      }
    ],
    "iconLabel": "Ecl"
  },
  {
    "id": "3",
    "title": "Is Timkit UI optimized for performance?",
    "icon": "ZapIcon",
    "collapsibles": [
      {
        "title": "What's the bundle size impact?",
        "content": "Our components are tree-shakeable and typically add minimal overhead to your bundle.",
        "open": true,
        "icon": "GaugeIcon",
        "iconLabel": "Gauge"
      },
      {
        "title": "How is code splitting handled?",
        "content": "We support automatic code splitting for optimal loading performance.",
        "icon": "CircleDashedIcon",
        "iconLabel": "Dash"
      }
    ],
    "iconLabel": "Zap"
  },
  {
    "id": "4",
    "title": "How accessible are the components?",
    "icon": "AtSignIcon",
    "collapsibles": [
      {
        "title": "Which screen readers are supported?",
        "content": "We test with NVDA, VoiceOver, and JAWS to ensure broad compatibility.",
        "icon": "GaugeIcon",
        "iconLabel": "Gauge"
      },
      {
        "title": "What about keyboard navigation?",
        "content": "Full keyboard navigation support is implemented following WAI-ARIA best practices.",
        "icon": "CircleDashedIcon",
        "iconLabel": "Dash"
      }
    ],
    "iconLabel": "@"
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