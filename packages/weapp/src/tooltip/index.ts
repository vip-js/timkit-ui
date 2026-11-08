import { createControl, type ControlState } from '@timui/core'

import { resolveClasses, tooltipContentVariants } from '../utils'
import { commitControl } from '../utils/control'
import { setupTooltipMachine } from './use-tooltip'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type WeappTooltipApi = {
  open?: boolean
  setOpen?: (open: boolean) => void
  close?: () => void
}

type WeappService = {
  setContext: (context: { disabled?: boolean; openDelay?: number; closeDelay?: number }) => void
}

type WeappTooltipInternal = WechatMiniprogram.Component.InstanceMethods<WeappTooltipApi> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: MachineEvent) => void
  _connect?: (state: object, send: (event: MachineEvent) => void) => WeappTooltipApi
  _openTimer?: ReturnType<typeof setTimeout>
  data: {
    api: WeappTooltipApi
    opened: boolean
    control?: ControlState
  }
  properties: {
    disabled: boolean
    openDelay: number
    delayDuration: number | string | null
    closeDelay: number
    open: boolean
    id: string
    extClass: string
  }
}

Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    disabled: { type: Boolean, value: false },
    open: { type: null, value: null },
    defaultOpen: { type: null, value: null },
    openDelay: { type: Number, value: 700 },
    delayDuration: { type: null, value: null },
    closeDelay: { type: Number, value: 300 },
    id: { type: String, value: 'tooltip' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappTooltipApi,
    contentClass: '',
    opened: false,
    openStatus: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappTooltipInternal
      const { controller, connect } = setupTooltipMachine(self)

      self._service = controller.service as WeappService
      self._send = controller.send as (event: MachineEvent) => void
      self._connect = connect
      self._cleanup = controller.start()
    },
    detached() {
      const self = this as WeappTooltipInternal
      this.clearOpenTimer()
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappTooltipInternal
      if (!state || !self._send || !self._connect) return
      let api = self.data.api
      try {
        api = self._connect(state, self._send) as WeappTooltipApi
      } catch {
        api = self.data.api
      }
      const contentClass = resolveClasses(tooltipContentVariants())
      this.setData({
        api,
        opened: Boolean(api.open),
        openStatus: api.open ? 'Opened' : '',
        contentClass,
      })
    },
    open(val: boolean) {
      const self = this as WeappTooltipInternal
      if (val == null || !self.data.api.setOpen || Boolean(val) === Boolean(self.data.opened)) return
      self.clearOpenTimer()
      self.data.api.setOpen(Boolean(val))
    },
  },

  methods: {
    clearOpenTimer() {
      const self = this as WeappTooltipInternal
      if (self._openTimer) clearTimeout(self._openTimer)
      self._openTimer = undefined
    },
    scheduleOpen() {
      const self = this as WeappTooltipInternal
      const next = commitControl(self, 'open')
      if (next.disabled || self.properties.disabled) return
      this.clearOpenTimer()
      const named = self.properties.delayDuration
      const delay = named == null || named === '' ? Number(self.properties.openDelay) : Number(named)
      const wait = Number.isFinite(delay) ? delay : 700
      const open = () => {
        if (self.properties.disabled) return
        if (self.properties.open != null) {
          self.triggerEvent('change', { open: true })
          return
        }
        self.data.api.setOpen?.(true)
        if (!self.data.opened) this.setData({ opened: true, openStatus: 'Opened' })
      }
      if (wait <= 0) open()
      else self._openTimer = setTimeout(open, wait)
    },
    onTriggerLongPress() {
      this.scheduleOpen()
    },
    onTriggerFocus() {
      this.scheduleOpen()
    },
    onTriggerKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Escape') this.onTriggerTouchEnd()
    },
    onTriggerTouchEnd() {
      const self = this as WeappTooltipInternal
      this.clearOpenTimer()
      if (self.properties.disabled) return
      if (self.properties.open != null) {
        self.triggerEvent('change', { open: false })
        return
      }
      self.data.api.setOpen?.(false)
      this.setData({ opened: false, openStatus: '' })
    },
  },
})
