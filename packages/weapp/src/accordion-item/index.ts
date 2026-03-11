type AccordionParent = {
  handleItemTap: (value: string) => void
}

type AccordionItemInstance = WechatMiniprogram.Component.InstanceMethods<{}, {}, {}> & {
  parent?: AccordionParent | null
  data: {
    disabled: boolean
    value: string
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  relations: {
    '../accordion/index': {
      type: 'parent',
      linked(target: AccordionParent) {
        ;(this as AccordionItemInstance).parent = target
      },
      unlinked() {
        ;(this as AccordionItemInstance).parent = null
      },
    },
  },

  properties: {
    value: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    className: {
      type: String,
      value: '',
    },
    iconExpandedClass: {
      type: String,
      value: 'rotate-180',
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  data: {
    expanded: false,
  },

  methods: {
    onTap() {
      const self = this as AccordionItemInstance
      if (self.data.disabled) return
      self.parent?.handleItemTap(self.data.value)
    },
  },
})
