import {
  createControl,
  dialogCloseVariants,
  dialogContentVariants,
  dialogOverlayVariants,
  reduceControl,
  reduceWidgetKey,
  type ControlState,
} from '@timui/core'

import { resolveClasses } from '../utils'
import { publishMachine } from '../utils/machine'
import { setupDialogMachine } from './use-dialog'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type PointerClick = { defaultPrevented?: boolean; stopPropagation?: () => void; preventDefault?: () => void }

const pointerClick = (): PointerClick => ({
  defaultPrevented: false,
  stopPropagation() {},
  preventDefault() {},
})

type WeappDialogApi = {
  open?: boolean
  setOpen?: (open: boolean) => void
  backdropProps?: {
    onClick?: (event?: PointerClick) => void
  }
  closeTriggerProps?: {
    onClick?: (event?: PointerClick) => void
  }
  getBackdropProps?: () => { onClick?: (event?: PointerClick) => void }
  getCloseTriggerProps?: () => { onClick?: (event?: PointerClick) => void }
  getTriggerProps?: () => { onClick?: (event?: PointerClick) => void }
}

type WeappService = {
  setContext: (context: { open?: boolean }) => void
}

type MachineSend = (event: MachineEvent) => void

type WeappDialogInternal = WechatMiniprogram.Component.InstanceMethods<WeappDialogApi> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: MachineSend
  _connect?: (state: object, send: MachineSend) => WeappDialogApi
  data: {
    api: WeappDialogApi
    control?: ControlState
  }
  properties: {
    open: boolean
    modal: boolean
    disabled: boolean
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
    open: {
      type: null,
      value: null,
    },
    defaultOpen: {
      type: null,
      value: null,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    modal: {
      type: Boolean,
      value: true,
    },
    id: {
      type: String,
      value: 'dialog',
    },
    title: {
      type: String,
      value: '',
    },
    'aria-label': {
      type: String,
      value: '',
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  data: {
    api: {} as WeappDialogApi,
    // Store variants class strings
    contentClass: '',
    overlayClass: '',
    closeClass: '',
    control: createControl() as ControlState,
    opened: false,
    openStatus: '',
    title: '',
    titleId: '',
    ariaLabel: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappDialogInternal
      const { controller, connect } = setupDialogMachine(this)

      self._service = controller.service as WeappService
      self._send = controller.send as MachineSend
      self._connect = connect
      self._cleanup = controller.start()
      const title = String(this.properties.title || '')
      this.setData({
        title,
        titleId: title ? `${this.properties.id || 'dialog'}-title` : '',
        ariaLabel: title ? '' : String(this.properties['aria-label'] || ''),
      })
      publishMachine(this)
    },
    detached() {
      const self = this as WeappDialogInternal
      self._cleanup?.()
    },
  },

  observers: {
    title: function (next: string) {
      const title = String(next || '')
      const titleId = title ? `${this.properties.id || 'dialog'}-title` : ''
      const ariaLabel = title ? '' : String(this.properties['aria-label'] || '')
      if (title === this.data.title && titleId === this.data.titleId && ariaLabel === this.data.ariaLabel) return
      this.setData({ title, titleId, ariaLabel })
    },
    'aria-label': function (next: string) {
      if (this.data.title) return
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    state: function (state) {
      const self = this as WeappDialogInternal
      if (!state || !self._send || !self._connect) return

      const api = self._connect(state, self._send) as WeappDialogApi

      const contentClass = resolveClasses(dialogContentVariants(), this.properties.extClass)
      const overlayClass = resolveClasses(dialogOverlayVariants())
      const closeClass = resolveClasses(dialogCloseVariants())

      this.setData({
        api,
        opened: api.open === true,
        openStatus: api.open === true ? 'Opened' : '',
        contentClass,
        overlayClass,
        closeClass,
      })
    },

    open: function (val) {
      const self = this as WeappDialogInternal
      if (val == null) return
      if (self._service) {
        if (val !== self.data.api.open) {
          self._send?.(val ? 'OPEN' : 'CLOSE')
        }
      }
    },
  },

  methods: {
    onTriggerTap() {
      const self = this as WeappDialogInternal
      if (self.properties.disabled) return
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: true })
        return
      }
      const click = pointerClick()
      self.data.api.getTriggerProps?.().onClick?.(click)
    },
    onBackdropTap() {
      if ((this as WeappDialogInternal).properties.modal === false) return
      this.onCloseTap()
    },
    onCloseKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onCloseTap()
    },
    onCloseTap() {
      const self = this as WeappDialogInternal
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: false })
        return
      }
      const next = reduceControl(self.data.control ?? createControl(), 'close')
      this.setData({ control: next })
      const click = pointerClick()
      self.data.api.getCloseTriggerProps?.().onClick?.(click)
      self.data.api.closeTriggerProps?.onClick?.(click)
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const next = reduceWidgetKey(
        'dialog',
        { open: this.data.opened === true, index: 0, count: 0, checked: false, value: 0, min: 0, max: 0, step: 1 },
        key
      )
      if (!next.handled || next.open) return
      this.onCloseTap()
    },
    noop() {},
  },
})
