Component({
  options: {
    styleIsolation: "apply-shared",
  },
  relations: {
    '../popover/popover': {
      type: 'parent',
    },
  },
  methods: {
    onTap() {
      const parents = this.getRelationNodes('../popover/popover')
      if (parents.length) {
        parents[0].toggle()
      }
    },
    getRect() {
      return new Promise((resolve) => {
        this.createSelectorQuery()
          .select('#popover-trigger')
          .boundingClientRect((rect) => {
            resolve(rect)
          })
          .exec()
      })
    },
  },
})
