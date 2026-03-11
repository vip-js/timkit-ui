import {
  AccordionMachineInstance,
  getAccordionItemOpen,
  setupAccordionMachine,
  toArray,
} from './use-accordion'

type AccordionItemNode = {
  data: {
    value: string
  }
  setData: (data: { expanded: boolean }) => void
}

type AccordionInternal = WechatMiniprogram.Component.TrivialInstance & {
  machine?: AccordionMachineInstance
  __machineUpdating?: boolean
  _updateChildren: () => void
  handleItemTap: (itemValue: string) => void
  triggerEvent: (name: string, detail?: object) => void
  getRelationNodes: (path: string) => AccordionItemNode[]
  data: {
    value: string[]
  }
  properties: {
    type: string
    collapsible: boolean
    disabled: boolean
  }
  updateItem: (target: AccordionItemNode) => void
}

Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],
  relations: {
    '../accordion-item/index': {
      type: 'child',
      linked(target: WechatMiniprogram.Component.TrivialInstance) {
        ;(this as AccordionInternal).updateItem(target as AccordionItemNode)
      },
      linkChanged(target: WechatMiniprogram.Component.TrivialInstance) {
        ;(this as AccordionInternal).updateItem(target as AccordionItemNode)
      },
    },
  },
  properties: {
    className: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: 'single', // 'single' | 'multiple'
    },
    collapsible: {
      type: Boolean,
      value: false,
    },
    // We can support value/defaultValue prop patterns if needed
    value: {
      type: null,
      value: null,
    },
    defaultValue: {
      type: null,
      value: null,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    extClass: {
      type: String,
      value: '',
    },
  },
  data: {
    value: [],
    multiple: false,
    collapsible: false,
  },
  lifetimes: {
    attached() {
      const self = this as AccordionInternal
      self.machine = setupAccordionMachine(self)
    },
  },
  observers: {
    value: function (newVal) {
      const self = this as AccordionInternal
      if (self.__machineUpdating) {
        self._updateChildren()
        return
      }
      if (newVal != null && self.machine) {
        const nextValue = toArray(newVal)
        self.machine.setProps({ value: nextValue })
        self.machine.send({ type: 'VALUE.SET', value: nextValue })
      }
      self._updateChildren()
    },
    'type, collapsible, disabled': function () {
      const self = this as AccordionInternal
      if (!self.machine) return
      const { type, collapsible, disabled } = self.properties
      self.machine.setProps({ multiple: type === 'multiple', collapsible, disabled })
      self._updateChildren()
    },
  },
  methods: {
    handleItemTap(itemValue: string) {
      const self = this as AccordionInternal
      if (!self.machine) return
      self.machine.send({ type: 'TRIGGER.FOCUS', value: itemValue })
      self.machine.send({ type: 'TRIGGER.CLICK', value: itemValue })
    },
    updateItem(target: AccordionItemNode) {
      if (!target) return
      const self = this as AccordionInternal
      const { value } = self.data
      const itemValue = target.data.value
      const expanded = getAccordionItemOpen(value, itemValue)

      target.setData({ expanded })
    },
    _updateChildren() {
      const self = this as AccordionInternal
      const nodes = self.getRelationNodes('../accordion-item/index')
      nodes.forEach((node) => {
        self.updateItem(node)
      })
    },
  },
})
