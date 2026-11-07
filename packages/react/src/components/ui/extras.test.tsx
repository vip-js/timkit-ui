// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { afterEach, describe, expect, it } from 'vitest'

import { DateField, DateInput, TimeField } from './datefield'
import { DateRangePicker, DateRangePickerTrigger } from './date-range-picker'
import { DataTable } from './data-table'
import { Group } from './group'
import { Header } from './header'
import { ListBox } from './list-box'
import { ListBoxItem } from './list-box-item'
import { ListBoxSection } from './list-box-section'
import { OTPInput } from './otpinput'
import { Presence } from './presence'
import { ProfileBg } from './profile-bg'
import { RangeCalendar } from './range-calendar'
import { ScrollBar } from './scroll-bar'
import { Slot } from './slot'
import { SonnerToaster } from './sonner'
import { StatusDot } from './status-dot'
import { Toaster } from './toaster'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false
    },
  }),
})

const mounted: Array<{ root: Root; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    act(() => item.root.unmount())
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (node: ReactNode) => {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  act(() => {
    root.render(node)
  })
  mounted.push({ root, host })
  return host
}

const extras = {
  slot: <Slot><button type="button">Slot</button></Slot>,
  toaster: <Toaster />,
  sonner: (
    <ThemeProvider>
      <SonnerToaster />
    </ThemeProvider>
  ),
  'date-field': (
    <DateField defaultValue="2026-02-14">
      <DateInput aria-label="Date" />
    </DateField>
  ),
  'time-field': (
    <TimeField defaultValue="09:30">
      <DateInput aria-label="Time" type="time" />
    </TimeField>
  ),
  'date-range-picker': (
    <DateRangePicker>
      <DateRangePickerTrigger>Range</DateRangePickerTrigger>
    </DateRangePicker>
  ),
  'range-calendar': <RangeCalendar />,
  group: <Group>Group</Group>,
  header: <Header>Header</Header>,
  'list-box': (
    <ListBox id="fruits" aria-label="Fruits">
      <ListBoxSection>
        <ListBoxItem value="apple">Apple</ListBoxItem>
      </ListBoxSection>
    </ListBox>
  ),
  otp: <OTPInput aria-label="Code" maxLength={4} defaultValue="12" />,
  presence: <Presence present>Shown</Presence>,
  'profile-bg': <ProfileBg>Profile</ProfileBg>,
  'scroll-bar': <ScrollBar />,
  'status-dot': <StatusDot>Online</StatusDot>,
  'data-table': (
    <DataTable
      caption="People"
      columns={[{ id: 'name', header: 'Name' }]}
      rows={[{ id: '1', cells: { name: 'Ada' } }]}
    />
  ),
}

describe('components outside the registry names', () => {
  it.each(Object.entries(extras))('%s renders', (name, node) => {
    const host = show(node)
    if (name === 'scroll-bar') {
      expect(host.childNodes.length).toBe(0)
      return
    }
    expect(host.innerHTML.length, name).toBeGreaterThan(0)
  })
})
