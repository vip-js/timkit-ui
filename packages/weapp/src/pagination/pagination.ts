// @ts-nocheck
import { emitTimEvent } from '../utils'
import {
  connectPaginationMachine,
  setupPaginationMachine,
  type WeappPaginationApi,
  type WeappPaginationService,
} from './use-pagination'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type PageTapEvent = WechatMiniprogram.BaseEvent & {
  currentTarget: {
    dataset: {
      page?: number
    }
  }
}

type WeappPaginationInternal = WechatMiniprogram.Component.InstanceMethods<{}> & {
  _service?: WeappPaginationService
  _cleanup?: () => void
  _send?: (event: MachineEvent) => void
  data: {
    api: WeappPaginationApi
  }
  properties: {
    page: number
    pageSize: number
    total: number
    siblingCount: number
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
    page: { type: null, value: null },
    defaultPage: { type: null, value: null },
    pageSize: { type: Number, value: 10 },
    total: { type: Number, value: 0 },
    siblingCount: { type: Number, value: 1 },
    disabled: { type: Boolean, value: false },
    id: { type: String, value: 'pagination' },
    extClass: { type: String, value: '' },
    'aria-label': { type: String, value: '' },
  },

  data: {
    api: {} as WeappPaginationApi,
    className: '',
    current: 1,
    pageCount: 1,
    ariaLabel: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappPaginationInternal
      const controller = setupPaginationMachine(this, {
        id: this.properties.id,
        defaultPage: (() => {
          const passed = this.properties.page
          const source = passed == null ? this.properties.defaultPage : passed
          if (source == null || source === '' || source === 0) return 1
          return Number(source) || 1
        })(),
        pageSize: this.properties.pageSize,
        count: this.properties.total,
        siblingCount: this.properties.siblingCount,
        onPageChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'pagination', {
            page: details.page,
            pageSize: details.pageSize,
          })
        },
      })

      self._service = controller.service as WeappPaginationService
      self._send = controller.send as (event: MachineEvent) => void
      self._cleanup = controller.start()
      this.setData({ ariaLabel: String(this.properties['aria-label'] || '') })
    },
    detached() {
      const self = this as WeappPaginationInternal
      self._cleanup?.()
    },
  },

  observers: {
    page: function (next) {
      if (next == null) return
      if (next === '' || next === 0) {
        this.setData({ current: 0 })
        return
      }
      const page = Number(next)
      const self = this as WeappPaginationInternal
      if (!Number.isFinite(page) || page < 1 || page === this.data.current) return
      self.data.api.setPage?.(page)
    },
    state: function (state) {
      const self = this as WeappPaginationInternal
      if (!state || !self._send) return
      const api = connectPaginationMachine(state, self._send) as WeappPaginationApi
      const held = this.properties.page
      const cleared = held === '' || held === 0
      this.setData({
        api,
        className: this.properties.extClass,
        current: cleared ? 0 : api.page || this.data.current,
        pageCount: this.lastPage(),
      })
    },
    pageSize: function () {
      this.syncBounds()
    },
    total: function () {
      this.syncBounds()
    },
    siblingCount: function () {
      this.syncBounds()
    },
    'aria-label'(next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
  },

  methods: {
    syncBounds() {
      const self = this as WeappPaginationInternal
      const service = self._service as { setContext?: (next: Record<string, number>) => void } | undefined
      if (!service?.setContext) return
      const pageSize = Number(this.properties.pageSize) || 10
      const count = Number(this.properties.total) || 0
      const siblingCount = Number(this.properties.siblingCount)
      service.setContext({
        pageSize,
        count,
        siblingCount: Number.isFinite(siblingCount) ? siblingCount : 1,
      })
      const totalPages = count <= 0 ? 1 : Math.max(1, Math.ceil(count / pageSize))
      this.setData({ pageCount: totalPages })
      const current = Number(this.data.current) || 1
      if (current > totalPages) self.data.api.setPage?.(totalPages)
    },
    lastPage() {
      const pageSize = Number(this.properties.pageSize) || 10
      const total = Number(this.properties.total) || 0
      if (total <= 0) return 1
      return Math.max(1, Math.ceil(total / pageSize))
    },
    askPage(page: number) {
      const pageSize = Number(this.properties.pageSize) || 10
      const next = Math.min(this.lastPage(), Math.max(1, page))
      if (next === Number(this.data.current)) return
      emitTimEvent(this, 'change', 'change', this.properties.id || 'pagination', {
        page: next,
        pageSize,
      })
    },
    onPrevKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onPrevTap()
    },
    onNextKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onNextTap()
    },
    onPageKey(event?: PageTapEvent & { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onPageTap(event)
    },
    onPrevTap() {
      const self = this as WeappPaginationInternal
      if (this.properties.disabled) return
      if (this.properties.page != null) {
        this.askPage(Number(this.data.current) - 1)
        return
      }
      self.data.api.goToPrevPage?.()
    },
    onNextTap() {
      const self = this as WeappPaginationInternal
      if (this.properties.disabled) return
      if (this.properties.page != null) {
        this.askPage(Number(this.data.current) + 1)
        return
      }
      self.data.api.goToNextPage?.()
    },
    onPageTap(e: PageTapEvent) {
      const self = this as WeappPaginationInternal
      if (this.properties.disabled) return
      const page = Number(e.currentTarget.dataset.page)
      if (!Number.isFinite(page) || page <= 0) return
      if (this.properties.page != null) {
        this.askPage(page)
        return
      }
      self.data.api.setPage?.(page)
      self.data.api.goToPage?.(page)
    },
  },
})
