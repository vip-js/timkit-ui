import { reduceWidgetKey } from '@timui/core'

import { setupPopoverMachine } from './use-popover'

type WeappPopoverApi = {
  triggerProps?: { onClick?: () => void }
  open?: boolean
  setOpen?: (open: boolean) => void
  close?: () => void
}

type WeappService = {
  setContext: (context: Record<string, object>) => void
}
type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

type WeappPopoverInternal = WechatMiniprogram.Component.InstanceMethods<WeappPopoverApi> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: object) => void
  _connect?: (state: object, send: MachineSend) => WeappPopoverApi
  data: {
    api: WeappPopoverApi
    opened: boolean
  }
  properties: {
    open: boolean
    modal: boolean
    portalled: boolean
    closeOnInteractOutside: boolean
    disabled: boolean
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

  properties: {
    open: { type: null, value: null },
    defaultOpen: { type: null, value: null },
    modal: { type: Boolean, value: false },
    portalled: { type: Boolean, value: true },
    closeOnInteractOutside: { type: Boolean, value: true },
    disabled: { type: Boolean, value: false },
    id: { type: String, value: 'popover' },
    extClass: { type: String, value: '' },
    'aria-label': { type: String, value: '' },
  },

  data: {
    api: {} as WeappPopoverApi,
    className: '',
    opened: false,
    openStatus: '',
    ariaLabel: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappPopoverInternal
      const { controller, connect } = setupPopoverMachine(self)

      self._service = controller.service as WeappService
      self._send = controller.send as MachineSend
      self._connect = connect
      self._cleanup = controller.start()
      this.setData({ ariaLabel: String(this.properties['aria-label'] || '') })
    },
    detached() {
      const self = this as WeappPopoverInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappPopoverInternal
      if (!state || !self._send || !self._connect) return
      let api = self.data.api
      try {
        api = self._connect(state, self._send) as WeappPopoverApi
      } catch {
        api = self.data.api
      }
      this.setData({
        api,
        opened: Boolean(api.open),
        openStatus: api.open ? 'Opened' : '',
        className: this.properties.extClass,
      })
    },

    'aria-label': function (next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    open: function (val: boolean) {
      const self = this as WeappPopoverInternal
      if (val == null || !self.data.api.setOpen || Boolean(val) === self.data.opened) return
      self.data.api.setOpen(Boolean(val))
    },
  },

  methods: {
    onTriggerKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onTriggerTap()
    },
    onTriggerTap() {
      const self = this as WeappPopoverInternal
      if (self.properties.disabled) return
      const open = !self.data.opened
      if (self.properties.open != null) {
        self.triggerEvent('change', { open })
        return
      }
      self.data.api.setOpen?.(open)
    },
    onBackdropTap() {
      this.askClose()
    },
    onCloseKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onCloseTap()
    },
    onCloseTap() {
      this.askClose()
    },
    askClose() {
      const self = this as WeappPopoverInternal
      if (self.properties.open != null) {
        self.triggerEvent('change', { open: false })
        return
      }
      self.data.api.setOpen?.(false)
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const next = reduceWidgetKey(
        'dialog',
        { open: this.data.opened === true, index: 0, count: 0, checked: false, value: 0, min: 0, max: 0, step: 1 },
        key
      )
      if (!next.handled || next.open) return
      this.askClose()
    },
  },
})
