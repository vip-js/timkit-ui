import { createControl, type ControlState } from '@timui/core'

import { emitTimEvent } from '../utils'
import { commitControl } from '../utils/control'
import { setupTagsInputMachine } from './use-tags-input'

type WeappTagsInputApi = {
  value?: string[]
  addValue?: (value: string) => void
  setValue?: (value: string[]) => void
  deleteValue?: (index: number) => void
}

type WeappService = {
  setContext: (context: Record<string, object>) => void
}

type InputEvent = WechatMiniprogram.CustomEvent<{
  value: string
}>

type DeleteTagEvent = WechatMiniprogram.BaseEvent & {
  currentTarget: {
    dataset: {
      index?: number
    }
  }
}

type WeappTagsInputInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: object) => void
    _connect?: (state: object, send: (event: object) => void) => WeappTagsInputApi
    data: {
      api: WeappTagsInputApi
      inputValue: string
      tags: string[]
      control?: ControlState
    }
    properties: {
      value: string[]
      max: number
      disabled: boolean
      readOnly: boolean
      allowOverflow: boolean
      placeholder: string
      'aria-label': string
      'aria-labelledby': string
      id: string
      extClass: string
    }
  }

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    max: { type: Number, value: Number.MAX_SAFE_INTEGER },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    allowOverflow: { type: Boolean, value: false },
    placeholder: { type: String, value: 'Add a tag' },
    'aria-label': { type: String, value: '' },
    'aria-labelledby': { type: String, value: '' },
    id: { type: String, value: 'tags-input' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappTagsInputApi,
    className: '',
    inputValue: '',
    tags: [] as string[],
    tagStatus: '',
    ariaLabel: '',
    labelledBy: '',
    highlightedIndex: -1,
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappTagsInputInternal
      const passed = this.properties.value
      const source = passed == null ? this.properties.defaultValue : passed
      const initial =
        source == null || source === '' ? [] : Array.isArray(source) ? source : [String(source)]
      const { service, start, send, connect } = setupTagsInputMachine(this, {
        id: this.properties.id,
        value: initial,
        max: this.properties.max,
        disabled: this.properties.disabled,
        readOnly: this.properties.readOnly,
        allowOverflow: this.properties.allowOverflow,
        onValueChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'tags-input', {
            value: details.value,
          })
        },
      })

      self._service = service as WeappService
      self._send = send as (event: object) => void
      self._connect = connect
      self._cleanup = start()
      this.setData({
        ariaLabel: String(this.properties['aria-label'] || ''),
        labelledBy: String(this.properties['aria-labelledby'] || ''),
      })
    },
    detached() {
      const self = this as WeappTagsInputInternal
      self._cleanup?.()
    },
  },

  observers: {
    'aria-label': function (next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    'aria-labelledby': function (next: string) {
      const labelledBy = String(next || '')
      if (labelledBy === this.data.labelledBy) return
      this.setData({ labelledBy })
    },
    value: function (val) {
      const self = this as WeappTagsInputInternal
      if (val == null) return
      const next = Array.isArray(val) ? val.map((item) => String(item)) : []
      const current = self.data.tags ?? []
      if (next.length === current.length && next.every((item, index) => item === current[index])) return
      self.data.api.setValue?.(next)
    },
    state: function (state) {
      const self = this as WeappTagsInputInternal
      if (!state || !self._send || !self._connect) return
      let api = self.data.api
      try {
        api = self._connect(state, self._send)
      } catch {
        api = self.data.api
      }
      const tags = Array.isArray(api.value) ? api.value.map((item) => String(item)) : []
      this.setData({ api, tags, tagStatus: this.tagText(tags), className: this.properties.extClass })
    },
  },

  methods: {
    tagText(tags: string[]) {
      const count = tags.filter(Boolean).length
      if (count === 0) return ''
      return count === 1 ? '1 tag' : `${count} tags`
    },
    onInput(e: InputEvent) {
      const self = this as WeappTagsInputInternal
      if (self.properties.disabled || self.properties.readOnly) return
      this.setData({ inputValue: e.detail.value, highlightedIndex: -1 })
    },
    onConfirm(e: InputEvent) {
      const self = this as WeappTagsInputInternal
      const value = e.detail.value.trim()
      const next = commitControl(self, 'select', value)
      if (!value || next.disabled || self.properties.readOnly || !self.data.api.addValue) return
      if (self.properties.value != null) {
        const tags = [...(self.data.tags || []), value]
        emitTimEvent(this, 'change', 'change', this.properties.id || 'tags-input', { value: tags })
        this.setData({ inputValue: '' })
        return
      }
      self.data.api.addValue(value)
      this.setData({ inputValue: '' })
    },
    onDeleteKey(e: DeleteTagEvent & { detail?: { key?: string } }) {
      const key = String(e?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onDeleteTag(e)
    },
    onInputKey(event?: { detail?: { key?: string } }) {
      if (this.properties.disabled || this.properties.readOnly) return
      const key = String(event?.detail?.key || '')
      if (key !== 'Backspace' && key !== 'Delete') return
      if (String(this.data.inputValue || '') !== '') return
      const tags = this.data.tags || []
      if (!tags.length) return
      const index = tags.length - 1
      if (this.data.highlightedIndex !== index) {
        this.setData({ highlightedIndex: index })
        return
      }
      this.setData({ highlightedIndex: -1 })
      this.onDeleteTag({ currentTarget: { dataset: { index } } })
    },
    onDeleteTag(e: DeleteTagEvent) {
      const self = this as WeappTagsInputInternal
      const index = e.currentTarget.dataset.index
      const next = commitControl(self, 'select')
      if (next.disabled || self.properties.readOnly || typeof index !== 'number' || !self.data.api.setValue) return
      const tags = self.data.tags.filter((_, itemIndex) => itemIndex !== index)
      if (self.properties.value != null) {
        emitTimEvent(this, 'change', 'change', this.properties.id || 'tags-input', { value: tags })
        return
      }
      self.data.api.setValue(tags)
    },
  },
})
