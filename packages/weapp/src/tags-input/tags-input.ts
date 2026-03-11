import { emitTimEvent } from '../utils'
import { setupTagsInputMachine } from './use-tags-input'

type WeappTagsInputApi = {
  addValue?: (value: string) => void
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
    data: {
      api: WeappTagsInputApi
      inputValue: string
    }
    properties: {
      value: string[]
      max: number
      disabled: boolean
      readOnly: boolean
      allowOverflow: boolean
      placeholder: string
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
    value: { type: Array, value: [] },
    max: { type: Number, value: Number.MAX_SAFE_INTEGER },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    allowOverflow: { type: Boolean, value: false },
    placeholder: { type: String, value: '添加标签...' },
    id: { type: String, value: 'tags-input' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappTagsInputApi,
    className: '',
    inputValue: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappTagsInputInternal
      const { service, cleanup, send } = setupTagsInputMachine(this, {
        id: this.properties.id,
        value: this.properties.value,
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
      self._cleanup = cleanup
      self._send = send as (event: object) => void
    },
    detached() {
      const self = this as WeappTagsInputInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappTagsInputInternal
      if (!state || !self._send) return
      const { connect } = setupTagsInputMachine(this, { id: this.properties.id })
      const api = connect(state, self._send) as WeappTagsInputApi
      this.setData({ api, className: this.properties.extClass })
    },
  },

  methods: {
    onInput(e: InputEvent) {
      this.setData({ inputValue: e.detail.value })
    },
    onConfirm(e: InputEvent) {
      const self = this as WeappTagsInputInternal
      const value = e.detail.value.trim()
      if (value && self.data.api.addValue) {
        self.data.api.addValue(value)
        this.setData({ inputValue: '' })
      }
    },
    onDeleteTag(e: DeleteTagEvent) {
      const self = this as WeappTagsInputInternal
      const index = e.currentTarget.dataset.index
      if (typeof index === 'number') {
        self.data.api.deleteValue?.(index)
      }
    },
  },
})
