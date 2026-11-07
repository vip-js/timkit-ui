import {
  alertDialogCancelVariants,
  buttonVariants,
  dialogCloseVariants,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
  reduceWidgetKey,
} from '@timui/core'

import { resolveClasses } from '../utils'
import { publishMachine } from '../utils/machine'
import { setupAlertDialogMachine } from './use-alert-dialog'

type AlertDialogApi = {
  open?: boolean
  backdropProps?: { onClick?: () => void }
  closeTriggerProps?: { onClick?: () => void }
  contentProps?: Record<string, string>
  titleProps?: Record<string, string>
  descriptionProps?: Record<string, string>
}

type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

type AlertDialogInstance = WechatMiniprogram.Component.InstanceMethods<AlertDialogApi> & {
  _service?: object
  _cleanup?: () => void
  _send?: MachineSend
  _connect?: (state: object, send: MachineSend) => AlertDialogApi
  data: {
    api: AlertDialogApi
  }
  properties: {
    id: string
    open: boolean
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    id: { type: String, value: 'alert-dialog' },
    open: { type: null, value: null },
    showTrigger: { type: Boolean, value: true },
    showClose: { type: Boolean, value: true },
    className: { type: String, value: '' },
    extClass: { type: String, value: '' },
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    cancelText: { type: String, value: '' },
    confirmText: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    defaultOpen: { type: null, value: null },
  },

  data: {
    api: {} as AlertDialogApi,
    opened: false,
    openStatus: '',
    confirmed: false,
    overlayClass: '',
    contentClass: '',
    titleClass: '',
    descriptionClass: '',
    footerClass: '',
    headerClass: '',
    cancelClass: '',
    confirmClass: '',
    closeClass: '',
  },

  lifetimes: {
    attached() {
      const self = this as AlertDialogInstance
      const passed = this.properties.open
      const initial = passed == null ? this.properties.defaultOpen === true : passed === true
      this.setData({ opened: initial, openStatus: initial ? 'Opened' : '', confirmed: false })
      const { controller, connect } = setupAlertDialogMachine(this)

      self._service = controller.service
      self._send = controller.send as MachineSend
      self._connect = connect
      self._cleanup = controller.start()
      publishMachine(this)
    },
    detached() {
      const self = this as AlertDialogInstance
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as AlertDialogInstance
      if (!state || !self._send || !self._connect) return

      const api = self._connect(state, self._send) as AlertDialogApi

      const overlayClass = resolveClasses(dialogOverlayVariants())
      const contentClass = resolveClasses(dialogContentVariants(), this.properties.className)
      const titleClass = resolveClasses(dialogTitleVariants())
      const descriptionClass = resolveClasses(dialogDescriptionVariants())
      const footerClass = resolveClasses(dialogFooterVariants())
      const headerClass = resolveClasses(dialogHeaderVariants())
      const cancelClass = resolveClasses(alertDialogCancelVariants())
      const confirmClass = resolveClasses(buttonVariants())
      const closeClass = resolveClasses(dialogCloseVariants())

      this.setData({
        api,
        opened: !!api.open,
        openStatus: api.open ? 'Opened' : '',
        overlayClass,
        contentClass,
        titleClass,
        descriptionClass,
        footerClass,
        headerClass,
        cancelClass,
        confirmClass,
        closeClass,
      })
    },

    open: function (val) {
      const self = this as AlertDialogInstance
      if (val == null) return
      if (self._service) {
        if (val !== self.data.api.open) {
          self._send?.(val ? 'OPEN' : 'CLOSE')
        }
      }
    },
  },

  methods: {
    onTriggerKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onTriggerTap()
    },
    onCloseKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onCloseTap()
    },
    onCancelKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onCancelTap()
    },
    onConfirmKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onConfirmTap()
    },
    onTriggerTap() {
      if (this.properties.disabled) return
      const self = this as AlertDialogInstance
      if (this.properties.open != null) {
        this.triggerEvent('change', { open: true })
        return
      }
      this.setData({ opened: true, openStatus: 'Opened' })
      self._send?.('OPEN')
    },
    onBackdropTap() {},
    onCloseTap() {
      this.onCancelTap()
    },
    onCancelTap() {
      if (this.properties.disabled) return
      const self = this as AlertDialogInstance
      if (this.properties.open != null) {
        this.triggerEvent('cancel')
        this.triggerEvent('change', { open: false })
        return
      }
      this.setData({ opened: false, openStatus: '' })
      this.triggerEvent('cancel')
      self._send?.('CLOSE')
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const next = reduceWidgetKey(
        'dialog',
        { open: this.data.opened === true, index: 0, count: 0, checked: false, value: 0, min: 0, max: 0, step: 1 },
        key
      )
      if (!next.handled || next.open) return
      this.onCancelTap()
    },
    onConfirmTap() {
      if (this.properties.disabled || !this.data.opened) return
      const self = this as AlertDialogInstance
      if (this.properties.open != null) {
        this.setData({ confirmed: true })
        this.triggerEvent('confirm')
        this.triggerEvent('change', { open: false })
        return
      }
      this.setData({ opened: false, openStatus: '', confirmed: true })
      this.triggerEvent('confirm')
      self._send?.('CLOSE')
    },
    noop() {},
  },
})
