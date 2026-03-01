Component({
  data: {
    value: "3",
    items: [
  {
    "id": "1",
    "title": "What makes Timkit UI different?",
    "content": "Timkit UI focuses on developer experience and performance. Built with TypeScript, it offers excellent type safety, follows accessibility standards, and provides comprehensive documentation with regular updates."
  },
  {
    "id": "2",
    "title": "How can I customize the components?",
    "content": "Use our CSS variables for global styling, or className and style props for component-specific changes. We support CSS modules, Tailwind, and dark mode out of the box."
  },
  {
    "id": "3",
    "title": "Is Timkit UI optimized for performance?",
    "content": "Yes, with tree-shaking, code splitting, and minimal runtime overhead. Most components are under 5KB gzipped."
  },
  {
    "id": "4",
    "title": "How accessible are the components?",
    "content": "All components follow WAI-ARIA standards, featuring proper ARIA attributes, keyboard navigation, and screen reader support. Regular testing ensures compatibility with NVDA, VoiceOver, and JAWS."
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