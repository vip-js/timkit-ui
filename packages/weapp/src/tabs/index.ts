import { createControl, reduceWidgetKey, type ControlState } from '@timui/core'

import { commitControl, controlEventValue } from '../utils/control'
import { publishMachine } from '../utils/machine'
import { setupTabsMachine } from './use-tabs'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type TabsOrientation = 'horizontal' | 'vertical'
type TabsActivationMode = 'manual' | 'automatic'

type WeappTabsApi = {
  value?: string
  setValue?: (value: string) => void
  clearValue?: () => void
}
type MachineSend = (event: MachineEvent) => void

type WeappService = {
  setContext: (context: {
    value?: string
    orientation?: TabsOrientation
    activationMode?: TabsActivationMode
  }) => void
}

type WeappTabsInternal = WechatMiniprogram.Component.InstanceMethods<WeappTabsApi> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: MachineEvent) => void
  _connect?: (state: object, send: MachineSend) => WeappTabsApi
  data: {
    api: WeappTabsApi
    activeValue?: string
    ariaLabel?: string
    control?: ControlState
  }
  properties: {
    value: string
    orientation: string
    activationMode: string
    id: string
    extClass: string
    disabled: boolean
    'aria-label': string
    tabs: Array<{ value?: string; disabled?: boolean; disable?: boolean }>
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
    orientation: { type: String, value: 'horizontal' },
    activationMode: { type: String, value: 'automatic' },
    id: { type: String, value: 'tabs' },
    disabled: { type: Boolean, value: false },
    extClass: { type: String, value: '' },
    tabs: { type: Array, value: [] },
    'aria-label': { type: String, value: '' },
  },

  data: {
    api: {} as WeappTabsApi,
    className: '',
    activeValue: '',
    tabStatus: '',
    ariaLabel: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappTabsInternal
      const { controller, connect } = setupTabsMachine(self)

      self._service = controller.service as WeappService
      self._send = controller.send as MachineSend
      self._connect = connect
      self._cleanup = controller.start()
      this.setData({ ariaLabel: String(this.properties['aria-label'] || '') })
      publishMachine(this)
    },
    detached() {
      const self = this as WeappTabsInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappTabsInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send) as WeappTabsApi
      const activeValue = api.value == null || api.value === '' ? '' : String(api.value)
      this.setData({
        api,
        className: this.properties.extClass,
        activeValue,
        tabStatus: this.tabText(activeValue),
      })
    },

    'aria-label': function (next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    value: function (val) {
      const self = this as WeappTabsInternal
      if (val == null) return
      const next = typeof val === 'string' ? val : ''
      const shown = String(self.data.activeValue ?? '')
      const machine = String(self.data.api?.value ?? '')
      if (next === shown && next === machine) return
      if (!next) {
        self.data.api.clearValue?.()
        return
      }
      self.data.api.setValue?.(next)
    },
  },

  methods: {
    tabText(active: string) {
      const tabs = this.properties.tabs ?? []
      const index = tabs.findIndex((tab) => tab.value === active)
      return !active || index < 0 ? '' : `Tab ${index + 1} of ${tabs.length}`
    },
    handleTabClick(event: WechatMiniprogram.TouchEvent) {
      const self = this as WeappTabsInternal
      const value = controlEventValue(event)
      const item = (self.properties.tabs ?? []).find((tab) => tab.value === value)
      if (item?.disabled || item?.disable) return
      const next = commitControl(self, 'select', value)
      if (!value || next.disabled) return
      if (self.properties.value != null) {
        this.triggerEvent('change', { value })
        return
      }
      this.setData({ activeValue: value, tabStatus: this.tabText(value) })
      self.data.api.setValue?.(value)
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      const self = this as WeappTabsInternal
      if (self.properties.disabled) return
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const vertical = self.properties.orientation === 'vertical'
      const horizontalKey = key === 'ArrowRight' || key === 'ArrowLeft'
      const verticalKey = key === 'ArrowDown' || key === 'ArrowUp'
      if ((vertical && horizontalKey) || (!vertical && verticalKey)) return
      const tabs = (self.properties.tabs ?? []).filter((tab) => tab.value && !tab.disabled && !tab.disable)
      if (!tabs.length) return
      const current = String(self.data.activeValue ?? '')
      let index = tabs.findIndex((tab) => tab.value === current)
      if (index < 0) index = 0
      const next = reduceWidgetKey(
        'tabs',
        { open: false, index, count: tabs.length, checked: false, value: 0, min: 0, max: 0, step: 1 },
        key
      )
      if (!next.handled) return
      const value = String(tabs[next.index]?.value ?? '')
      if (!value || value === current) return
      this.handleTabClick({ currentTarget: { dataset: { value } } } as WechatMiniprogram.TouchEvent)
    },
  },
})
