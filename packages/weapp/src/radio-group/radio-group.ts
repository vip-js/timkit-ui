import { createControl, type ControlState } from '@timui/core'

import { radioGroupVariants, resolveClasses } from '../utils'
import { commitControl } from '../utils/control'
import { publishMachine } from '../utils/machine'
import { setupRadioGroupMachine } from './use-radio-group'

type RadioItemNode = {
  properties?: { value?: string; disabled?: boolean }
  setData: (data: { checked: boolean; tabIndex: number; groupDisabled: boolean }) => void
}

type RadioGroupApi = {
  value?: string | null
  setValue?: (value: string) => void
}

type MachineSend = (event: { type: string; value?: string | null; isTrusted?: boolean }) => void

type RadioGroupInternal = WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
  _cleanup?: () => void
  _send?: MachineSend
  _connect?: (state: object, send: MachineSend) => RadioGroupApi
  getRelationNodes: (path: string) => RadioItemNode[]
    data: {
    api: RadioGroupApi
    selected: string
    ariaLabel?: string
    control?: ControlState
  }
  properties: {
    value: string
    name: string
    disabled: boolean
    readOnly: boolean
    orientation: string
    id: string
    extClass: string
    'aria-label': string
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  relations: {
    '../radio-group-item/radio-group-item': {
      type: 'descendant',
      linked() {
        const self = this as RadioGroupInternal
        self.syncItems(self.data.selected)
      },
      linkChanged() {
        const self = this as RadioGroupInternal
        self.syncItems(self.data.selected)
      },
      unlinked() {
        const self = this as RadioGroupInternal
        self.syncItems(self.data.selected)
      },
    },
  },

  properties: {
    value: {
      type: null,
      value: null,
    },
    defaultValue: {
      type: null,
      value: null,
    },
    name: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    readOnly: {
      type: Boolean,
      value: false,
    },
    required: {
      type: Boolean,
      value: false,
    },
    orientation: {
      type: String,
      value: 'vertical',
    },
    id: {
      type: String,
      value: 'radio-group',
    },
    extClass: {
      type: String,
      value: '',
    },
    'aria-label': {
      type: String,
      value: '',
    },
  },

  data: {
    api: {} as RadioGroupApi,
    selected: '',
    optionStatus: '',
    className: '',
    orientation: 'vertical',
    ariaLabel: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as RadioGroupInternal
      const { start, send, connect } = setupRadioGroupMachine(this)
      self._send = send
      self._connect = connect
      self._cleanup = start()
      this.setData({ ariaLabel: String(this.properties['aria-label'] || '') })
      publishMachine(this)
    },
    detached() {
      ;(this as RadioGroupInternal)._cleanup?.()
    },
  },

  observers: {
    state(state: object) {
      const self = this as RadioGroupInternal
      if (!state || !self._send || !self._connect) return
      let api: RadioGroupApi = {}
      try {
        api = self._connect(state, self._send)
      } catch {
        api = self.data.api
      }
      const selected = api.value == null ? '' : String(api.value)
      const { baseClass } = resolveClasses(radioGroupVariants(), self.properties.extClass)
      this.setData({
        api,
        selected,
        optionStatus: this.optionText(selected),
        className: baseClass,
        orientation: this.properties.orientation === 'horizontal' ? 'horizontal' : 'vertical',
      })
      self.syncItems(selected)
    },

    'aria-label'(next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    disabled() {
      const self = this as RadioGroupInternal
      self.syncItems(String(self.data.selected || ''))
    },
    value(val: string) {
      const self = this as RadioGroupInternal
      if (val == null || !self._send) return
      const next = String(val || '')
      if (next === String(self.data.selected || '')) return
      self._send({ type: 'SET_VALUE', value: next ? next : null, isTrusted: false })
    },
  },

  methods: {
    optionText(selected: string) {
      if (!selected || typeof this.getRelationNodes !== 'function') return ''
      const nodes = this.getRelationNodes('../radio-group-item/radio-group-item')
      const values = nodes.map((node) => node.properties?.value).filter((value): value is string => Boolean(value))
      const index = values.indexOf(selected)
      return index < 0 ? '' : `Option ${index + 1} of ${values.length}`
    },
    onItemKey(value: string, key: string) {
      const self = this as RadioGroupInternal
      if (self.properties.disabled || self.properties.readOnly) return
      if (key === 'Enter' || key === ' ') {
        this.handleChildChange(value)
        return
      }
      if (/^[a-z]$/i.test(key)) {
        const nodes = self.getRelationNodes('../radio-group-item/radio-group-item')
        const enabled = nodes.filter((node) => node.properties?.value && !node.properties.disabled)
        const letter = key.toLowerCase()
        const current = String(self.data.selected || '')
        const index = enabled.findIndex((node) => node.properties?.value === current)
        for (let step = 1; step <= enabled.length; step += 1) {
          const next = enabled[(index + step) % enabled.length]
          const name = String(next?.properties?.value || '')
          if (!name.toLowerCase().startsWith(letter)) continue
          this.handleChildChange(name)
          return
        }
        return
      }
      const horizontal = self.properties.orientation === 'horizontal'
      const delta = horizontal
        ? key === 'ArrowRight'
          ? 1
          : key === 'ArrowLeft'
            ? -1
            : 0
        : key === 'ArrowDown'
          ? 1
          : key === 'ArrowUp'
            ? -1
            : 0
      if (!delta) return
      const nodes = self.getRelationNodes('../radio-group-item/radio-group-item')
      const enabled = nodes.filter((node) => node.properties?.value && !node.properties.disabled)
      if (!enabled.length) return
      const current = String(self.data.selected || value || '')
      let index = enabled.findIndex((node) => node.properties?.value === current)
      if (index < 0) index = delta > 0 ? -1 : 0
      const next = enabled[(index + delta + enabled.length) % enabled.length]
      const nextValue = next?.properties?.value
      if (nextValue) this.handleChildChange(nextValue)
    },
    handleChildChange(value: string) {
      const self = this as RadioGroupInternal
      const next = commitControl(self, 'select', value)
      if (!value || next.disabled || self.properties.readOnly) return
      if (self.properties.value != null) {
        this.triggerEvent('change', { value })
        return
      }
      self._send?.({ type: 'SET_VALUE', value, isTrusted: false })
    },
    syncItems(selected: string) {
      const self = this as RadioGroupInternal
      if (typeof self.getRelationNodes !== 'function') return
      const nodes = self.getRelationNodes('../radio-group-item/radio-group-item')
      const groupDisabled = !!self.properties.disabled
      const enabled = nodes.filter((node) => node.properties?.value && !node.properties.disabled && !groupDisabled)
      const selectedNode = nodes.find((node) => selected && node.properties?.value === selected)
      const tabbable =
        !groupDisabled && selectedNode && !selectedNode.properties?.disabled ? selectedNode : enabled[0]
      for (const node of nodes) {
        node.setData({
          checked: node === selectedNode,
          tabIndex: node === tabbable ? 0 : -1,
          groupDisabled,
        })
      }
    },
  },
})
