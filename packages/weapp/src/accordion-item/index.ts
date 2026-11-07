type AccordionParent = {
  handleItemTap: (value: string) => void
}

type AccordionItemInstance = WechatMiniprogram.Component.InstanceMethods<{}, {}, {}> & {
  parent?: AccordionParent | null
  properties: {
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
    onKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onTap()
    },
    onTap() {
      const self = this as AccordionItemInstance
      if (self.properties.disabled) return
      const value = String(self.properties.value || '')
      if (!value) return
      self.parent?.handleItemTap(value)
    },
  },
})
