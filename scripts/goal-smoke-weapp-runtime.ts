import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

type ComponentDefinition = {
  methods?: Record<string, (...args: object[]) => object>
  observers?: Record<string, (...args: object[]) => object>
}

type ComponentRegistrar = (definition: ComponentDefinition) => void

const ROOT = path.resolve(__dirname, '..')

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const loadTsComponent = async (relativePath: string) => {
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: ComponentRegistrar }).Component = (definition) => {
    captured = definition
  }

  const absolutePath = path.join(ROOT, relativePath)
  const moduleUrl = `${pathToFileURL(absolutePath).href}?t=${Date.now()}`
  await import(moduleUrl)

  assert(!!captured, `Component() was not called in ${relativePath}`)
  return captured as ComponentDefinition
}

const runSelectMethodChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/select/select.ts')
  const methods = definition.methods || {}

  const calls: string[] = []
  const context = {
    _collection: {
      find: (value: string) => (value === 'beijing' ? { value } : undefined),
    },
    data: {
      api: {
        triggerProps: {
          onClick: () => calls.push('select.trigger.click'),
        },
        selectValue: (value: string) => calls.push(`select.value.${value}`),
        setOpen: (open: boolean) => calls.push(`select.open.${String(open)}`),
      },
    },
  }

  methods.onTriggerTap?.call(context)
  methods.onItemTap?.call(context, { mark: { value: 'beijing' } })
  methods.onBackdropTap?.call(context)

  assert(calls.includes('select.trigger.click'), 'select onTriggerTap should invoke onClick')
  assert(calls.includes('select.value.beijing'), 'select onItemTap should select value')
  assert(
    calls.filter((item) => item === 'select.open.false').length === 2,
    'select should close on item tap and backdrop tap'
  )
}

const runComboboxMethodChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/combobox/combobox.ts')
  const methods = definition.methods || {}

  const calls: string[] = []
  const context = {
    _collection: {
      find: (value: string) => (value === 'shanghai' ? { value } : undefined),
    },
    data: {
      api: {
        triggerProps: {
          onClick: () => calls.push('combobox.trigger.click'),
        },
        selectValue: (value: string) => calls.push(`combobox.value.${value}`),
        setOpen: (open: boolean) => calls.push(`combobox.open.${String(open)}`),
      },
    },
  }

  methods.onTriggerTap?.call(context)
  methods.onItemTap?.call(context, { mark: { value: 'shanghai' } })
  methods.onBackdropTap?.call(context)

  assert(calls.includes('combobox.trigger.click'), 'combobox onTriggerTap should invoke onClick')
  assert(calls.includes('combobox.value.shanghai'), 'combobox onItemTap should select value')
  assert(
    calls.filter((item) => item === 'combobox.open.false').length === 2,
    'combobox should close on item tap and backdrop tap'
  )
}

const runDialogMethodChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/dialog/dialog.ts')
  const methods = definition.methods || {}

  const calls: string[] = []
  const context = {
    data: {
      api: {
        backdropProps: {
          onClick: () => calls.push('dialog.backdrop.click'),
        },
        closeTriggerProps: {
          onClick: () => calls.push('dialog.close.click'),
        },
      },
    },
  }

  methods.onBackdropTap?.call(context)
  methods.onCloseTap?.call(context)

  assert(calls.includes('dialog.backdrop.click'), 'dialog onBackdropTap should invoke onClick')
  assert(calls.includes('dialog.close.click'), 'dialog onCloseTap should invoke onClick')
}

const runTabsMethodChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/tabs/index.ts')
  const methods = definition.methods || {}
  assert(typeof methods.handleTabClick === 'function', 'tabs handleTabClick should exist')

  const setDataCalls: Array<Record<string, string>> = []
  const sent: Array<Record<string, string>> = []
  const context = {
    _send: (event: Record<string, string>) => sent.push(event),
    setData: (payload: Record<string, string>) => {
      setDataCalls.push(payload)
    },
  }

  methods.handleTabClick?.call(context, { currentTarget: { dataset: { value: 'overview' } } })

  assert(
    setDataCalls.some((payload) => payload.activeValue === 'overview'),
    'tabs handleTabClick should sync activeValue'
  )
  assert(
    sent.some(
      (event) => JSON.stringify(event) === JSON.stringify({ type: 'VALUE.SET', value: 'overview' })
    ),
    'tabs handleTabClick should dispatch VALUE.SET'
  )
}

const runDropdownMenuMethodChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/dropdown-menu/dropdown-menu.ts')
  const methods = definition.methods || {}

  const calls: string[] = []
  const context = {
    data: {
      api: {
        triggerProps: {
          onClick: () => calls.push('dropdown.trigger.click'),
        },
        selectItem: (item: { value: string }) => calls.push(`dropdown.select.${item.value}`),
        setOpen: (open: boolean) => calls.push(`dropdown.open.${String(open)}`),
      },
    },
  }

  methods.onTriggerTap?.call(context)
  methods.onItemTap?.call(context, { currentTarget: { dataset: { value: 'settings' } } })
  methods.onBackdropTap?.call(context)

  assert(
    calls.includes('dropdown.trigger.click'),
    'dropdown-menu onTriggerTap should invoke onClick'
  )
  assert(
    calls.includes('dropdown.select.settings'),
    'dropdown-menu onItemTap should select dataset value'
  )
  assert(calls.includes('dropdown.open.false'), 'dropdown-menu onBackdropTap should close menu')
}

const runRadioGroupObserverChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/radio-group/radio-group.ts')
  const observers = definition.observers || {}
  const valueObserver = observers.value
  const disabledObserver = observers.disabled

  assert(typeof valueObserver === 'function', 'radio-group value observer should exist')
  assert(typeof disabledObserver === 'function', 'radio-group disabled observer should exist')

  const calls: Array<Record<string, string | boolean>> = []
  const context = {
    _service: {
      setContext: (payload: Record<string, string | boolean>) => {
        calls.push(payload)
      },
    },
  }

  valueObserver?.call(context, 'news')
  disabledObserver?.call(context, true)

  assert(
    calls.some((item) => item.value === 'news'),
    'radio-group value observer should sync value'
  )
  assert(
    calls.some((item) => item.disabled === true),
    'radio-group disabled observer should sync disabled state'
  )
}

const runCheckboxChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/checkbox/checkbox.ts')
  const methods = definition.methods || {}
  const observers = definition.observers || {}

  const clicks: string[] = []
  const events: object[] = []
  const sent: object[] = []
  const context = {
    _service: { send: (event: object) => sent.push(event) },
    _send: (event: object) => sent.push(event),
    data: {
      api: {
        checked: false,
        rootProps: {
          onClick: () => clicks.push('checkbox.click'),
        },
      },
    },
  }

  methods.onTap?.call(context, { type: 'tap' })
  observers.checked?.call(context, true)
  observers.disabled?.call(context, true)

  assert(clicks.includes('checkbox.click'), 'checkbox onTap should invoke root onClick')
  assert(
    sent.some(
      (event) => JSON.stringify(event) === JSON.stringify({ type: 'CHECKED.SET', checked: true })
    ),
    'checkbox checked observer should dispatch CHECKED.SET'
  )
  assert(
    sent.some(
      (event) => JSON.stringify(event) === JSON.stringify({ type: 'DISABLED.SET', disabled: true })
    ),
    'checkbox disabled observer should dispatch DISABLED.SET'
  )

  events.push(...sent)
  assert(events.length >= 2, 'checkbox should dispatch observer sync events')
}

const runSwitchChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/switch/switch.ts')
  const methods = definition.methods || {}
  const observers = definition.observers || {}

  const emitted: Array<{ name: string; detail: Record<string, unknown> }> = []
  const setDataCalls: Array<Record<string, string>> = []
  const context = {
    properties: {
      id: 'switch',
      extClass: 'custom-switch',
    },
    setData: (payload: Record<string, string>) => {
      setDataCalls.push(payload)
    },
    triggerEvent: (name: string, detail: Record<string, unknown>) => {
      emitted.push({ name, detail })
    },
    data: {
      className: '',
    },
    updateClassName: methods.updateClassName,
  }

  observers.extClass?.call(context, 'custom-switch')
  methods.onSwitchChange?.call(context, { detail: { value: true } })

  assert(
    setDataCalls.some((payload) => String(payload.className || '').includes('custom-switch')),
    'switch extClass observer should refresh className'
  )
  assert(
    emitted.some(
      (event) =>
        event.name === 'input' && JSON.stringify(event.detail) === JSON.stringify({ value: true })
    ),
    'switch should emit raw input event'
  )
  assert(
    emitted.some((event) => event.name === 'change' && typeof event.detail === 'object'),
    'switch should emit TimEvent change'
  )
}

const runSliderObserverChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/slider/slider.ts')
  const observers = definition.observers || {}
  const methods = definition.methods || {}

  const emitted: Array<{ name: string; detail: Record<string, unknown> }> = []
  const setDataCalls: Array<Record<string, string>> = []
  const context = {
    properties: {
      id: 'slider',
      extClass: 'custom-slider',
    },
    setData: (payload: Record<string, string>) => {
      setDataCalls.push(payload)
    },
    triggerEvent: (name: string, detail: Record<string, unknown>) => {
      emitted.push({ name, detail })
    },
    updateClassName: methods.updateClassName,
  }

  observers.extClass?.call(context, 'custom-slider')
  methods.onSliderChanging?.call(context, { detail: { value: 42 } })
  methods.onSliderChange?.call(context, { detail: { value: 42 } })

  assert(
    setDataCalls.some((payload) => String(payload.rootClass || '').includes('custom-slider')),
    'slider extClass observer should refresh rootClass'
  )
  assert(
    emitted.some(
      (event) =>
        event.name === 'changing' && JSON.stringify(event.detail) === JSON.stringify({ value: 42 })
    ),
    'slider should emit raw changing event'
  )
  assert(
    emitted.some((event) => event.name === 'change' && typeof event.detail === 'object'),
    'slider should emit TimEvent change'
  )
  assert(
    emitted.some((event) => event.name === 'change-end' && typeof event.detail === 'object'),
    'slider should emit TimEvent change-end'
  )
}

const runDatePickerObserverChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/date-picker/date-picker.ts')
  const observers = definition.observers || {}
  const extClassObserver = observers.extClass
  assert(typeof extClassObserver === 'function', 'date-picker extClass observer should exist')

  let payload: Record<string, object> | null = null
  const context = {
    setData: (next: Record<string, object>) => {
      payload = next
    },
  }
  extClassObserver?.call(context, 'custom-date')

  const className = String(payload?.className ?? '')
  assert(className.includes('w-full'), 'date-picker className should include base class w-full')
  assert(className.includes('custom-date'), 'date-picker className should include extClass')
}

const runCalendarObserverChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/calendar/calendar.ts')
  const observers = definition.observers || {}
  const extClassObserver = observers.extClass
  assert(typeof extClassObserver === 'function', 'calendar extClass observer should exist')

  let payload: Record<string, object> | null = null
  const context = {
    setData: (next: Record<string, object>) => {
      payload = next
    },
  }
  extClassObserver?.call(context, 'custom-calendar')

  const className = String(payload?.className ?? '')
  assert(className.includes('w-fit'), 'calendar className should include base class w-fit')
  assert(className.includes('custom-calendar'), 'calendar className should include extClass')
}

const runTagsInputMethodChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/tags-input/tags-input.ts')
  const methods = definition.methods || {}

  const calls: string[] = []
  const setDataCalls: Array<Record<string, object>> = []
  const context = {
    setData: (next: Record<string, object>) => {
      setDataCalls.push(next)
    },
    data: {
      api: {
        addValue: (value: string) => calls.push(`tags.add.${value}`),
        deleteValue: (index: number) => calls.push(`tags.delete.${index}`),
      },
      inputValue: '',
    },
  }

  methods.onInput?.call(context, { detail: { value: 'foo' } })
  methods.onConfirm?.call(context, { detail: { value: '  foo  ' } })
  methods.onDeleteTag?.call(context, { currentTarget: { dataset: { index: 2 } } })

  assert(
    setDataCalls.some((item) => item.inputValue === 'foo'),
    'tags-input onInput should update inputValue'
  )
  assert(calls.includes('tags.add.foo'), 'tags-input onConfirm should add trimmed value')
  assert(
    setDataCalls.some((item) => item.inputValue === ''),
    'tags-input onConfirm should clear inputValue after add'
  )
  assert(calls.includes('tags.delete.2'), 'tags-input onDeleteTag should delete by dataset index')
}

const runInputMethodChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/input/input.ts')
  const methods = definition.methods || {}
  const observers = definition.observers || {}

  const emitted: Array<{ name: string; detail: object }> = []
  const setDataCalls: Array<Record<string, object>> = []
  const context = {
    properties: {
      type: 'search',
      extClass: 'custom-input',
    },
    setData: (next: Record<string, object>) => {
      setDataCalls.push(next)
    },
    triggerEvent: (name: string, detail: object) => {
      emitted.push({ name, detail })
    },
    updateClassName: methods.updateClassName,
  }

  observers['type, extClass']?.call(context)
  methods.onInput?.call(context, { detail: { value: 'hello' } })
  methods.onFocus?.call(context, { detail: { value: 'hello' } })
  methods.onBlur?.call(context, { detail: { value: 'hello' } })
  methods.onConfirm?.call(context, { detail: { value: 'hello' } })

  assert(
    setDataCalls.some((item) => Object.prototype.hasOwnProperty.call(item, 'className')),
    'input observer should write className via setData'
  )
  assert(
    setDataCalls.some((item) => item.value === 'hello'),
    'input onInput should update value'
  )
  const names = emitted.map((item) => item.name)
  assert(names.includes('input'), 'input should emit input event')
  assert(names.includes('focus'), 'input should emit focus event')
  assert(names.includes('blur'), 'input should emit blur event')
  assert(names.includes('confirm'), 'input should emit confirm event')
}

const runTextareaMethodChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/textarea/textarea.ts')
  const methods = definition.methods || {}
  const observers = definition.observers || {}

  const emitted: Array<{ name: string; detail: object }> = []
  const setDataCalls: Array<Record<string, object>> = []
  const context = {
    properties: {
      extClass: 'custom-textarea',
    },
    setData: (next: Record<string, object>) => {
      setDataCalls.push(next)
    },
    triggerEvent: (name: string, detail: object) => {
      emitted.push({ name, detail })
    },
    updateClassName: methods.updateClassName,
  }

  observers.extClass?.call(context)
  methods.onInput?.call(context, { detail: { value: 'line1' } })
  methods.onFocus?.call(context, { detail: { value: 'line1' } })
  methods.onBlur?.call(context, { detail: { value: 'line1' } })
  methods.onConfirm?.call(context, { detail: { value: 'line1' } })

  assert(
    setDataCalls.some((item) => Object.prototype.hasOwnProperty.call(item, 'className')),
    'textarea observer should write className via setData'
  )
  assert(
    setDataCalls.some((item) => item.value === 'line1'),
    'textarea onInput should update value'
  )
  const names = emitted.map((item) => item.name)
  assert(names.includes('input'), 'textarea should emit input event')
  assert(names.includes('focus'), 'textarea should emit focus event')
  assert(names.includes('blur'), 'textarea should emit blur event')
  assert(names.includes('confirm'), 'textarea should emit confirm event')
}

const runSelectNativeChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/select-native/select-native.ts')
  const methods = definition.methods || {}
  const observers = definition.observers || {}

  const emitted: Array<{ name: string; detail: object }> = []
  const setDataCalls: Array<Record<string, object>> = []
  const context = {
    properties: {
      options: ['A', 'B', 'C'],
      value: 1,
      extClass: 'custom-native-select',
    },
    setData: (next: Record<string, object>) => {
      setDataCalls.push(next)
    },
    triggerEvent: (name: string, detail: object) => {
      emitted.push({ name, detail })
    },
    updateDisplay: methods.updateDisplay,
  }

  observers['options, value, extClass']?.call(context)
  methods.handleChange?.call(context, { detail: { value: '2' } })

  assert(
    setDataCalls.some((item) => item.displayText === 'B'),
    'select-native observer should compute displayText from value'
  )
  assert(
    setDataCalls.some((item) => String(item.className ?? '').includes('custom-native-select')),
    'select-native observer should apply extClass to className'
  )
  assert(
    setDataCalls.some((item) => item.displayText === 'C'),
    'select-native handleChange should update displayText for new value'
  )
  assert(
    emitted.some(
      (item) =>
        item.name === 'change' &&
        item.detail.type === 'change' &&
        JSON.stringify(item.detail.target) === JSON.stringify({ id: 'select-native' }) &&
        JSON.stringify(item.detail.detail) === JSON.stringify({ value: 2 })
    ),
    'select-native handleChange should emit TimEvent change payload'
  )
}

const runPaginationMethodChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/pagination/pagination.ts')
  const methods = definition.methods || {}

  const calls: string[] = []
  const context = {
    data: {
      api: {
        goToPrevPage: () => calls.push('pagination.prev'),
        goToNextPage: () => calls.push('pagination.next'),
        goToPage: (page: number) => calls.push(`pagination.page.${page}`),
      },
    },
  }

  methods.onPrevTap?.call(context)
  methods.onNextTap?.call(context)
  methods.onPageTap?.call(context, { currentTarget: { dataset: { page: 6 } } })

  assert(calls.includes('pagination.prev'), 'pagination onPrevTap should call goToPrevPage')
  assert(calls.includes('pagination.next'), 'pagination onNextTap should call goToNextPage')
  assert(calls.includes('pagination.page.6'), 'pagination onPageTap should call goToPage')
}

const runStepperMethodChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/stepper/stepper.ts')
  const methods = definition.methods || {}
  const observers = definition.observers || {}

  const calls: string[] = []
  const contexts: Array<Record<string, object>> = []
  const context = {
    _service: {
      setContext: (payload: Record<string, object>) => contexts.push(payload),
    },
    data: {
      api: {
        decrement: () => calls.push('stepper.decrement'),
        increment: () => calls.push('stepper.increment'),
        setValue: (value: string) => calls.push(`stepper.value.${value}`),
      },
    },
  }

  methods.onDecrementTap?.call(context)
  methods.onIncrementTap?.call(context)
  methods.onInput?.call(context, { detail: { value: '9' } })
  observers.value?.call(context, '11')

  assert(calls.includes('stepper.decrement'), 'stepper onDecrementTap should call decrement')
  assert(calls.includes('stepper.increment'), 'stepper onIncrementTap should call increment')
  assert(calls.includes('stepper.value.9'), 'stepper onInput should call setValue')
  assert(
    contexts.some((item) => JSON.stringify(item) === JSON.stringify({ value: '11' })),
    'stepper value observer should sync context value'
  )
}

const runNumberInputMethodChecks = async () => {
  const definition = await loadTsComponent('packages/weapp/src/number-input/number-input.ts')
  const methods = definition.methods || {}
  const observers = definition.observers || {}

  const calls: string[] = []
  const contexts: Array<Record<string, object>> = []
  const context = {
    _service: {
      setContext: (payload: Record<string, object>) => contexts.push(payload),
    },
    data: {
      api: {
        decrement: () => calls.push('number-input.decrement'),
        increment: () => calls.push('number-input.increment'),
        setValue: (value: string) => calls.push(`number-input.value.${value}`),
      },
    },
  }

  methods.onDecrementTap?.call(context)
  methods.onIncrementTap?.call(context)
  methods.onInput?.call(context, { detail: { value: '5' } })
  observers.value?.call(context, '7')

  assert(
    calls.includes('number-input.decrement'),
    'number-input onDecrementTap should call decrement'
  )
  assert(
    calls.includes('number-input.increment'),
    'number-input onIncrementTap should call increment'
  )
  assert(calls.includes('number-input.value.5'), 'number-input onInput should call setValue')
  assert(
    contexts.some((item) => JSON.stringify(item) === JSON.stringify({ value: '7' })),
    'number-input value observer should sync context value'
  )
}

const runCheck = async (name: string, check: () => Promise<void>) => {
  try {
    await check()
    console.log(`- ${name}: PASS`)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(`${name}: ${reason}`)
  }
}

const main = async () => {
  console.log('Weapp runtime smoke: START')
  await runCheck('select', runSelectMethodChecks)
  await runCheck('combobox', runComboboxMethodChecks)
  await runCheck('dialog', runDialogMethodChecks)
  await runCheck('dropdown-menu', runDropdownMenuMethodChecks)
  await runCheck('radio-group', runRadioGroupObserverChecks)
  await runCheck('checkbox', runCheckboxChecks)
  await runCheck('switch', runSwitchChecks)
  await runCheck('slider', runSliderObserverChecks)
  await runCheck('date-picker', runDatePickerObserverChecks)
  await runCheck('calendar', runCalendarObserverChecks)
  await runCheck('tags-input', runTagsInputMethodChecks)
  await runCheck('input', runInputMethodChecks)
  await runCheck('textarea', runTextareaMethodChecks)
  await runCheck('select-native', runSelectNativeChecks)
  await runCheck('pagination', runPaginationMethodChecks)
  await runCheck('stepper', runStepperMethodChecks)
  await runCheck('number-input', runNumberInputMethodChecks)
  await runCheck('tabs-methods', runTabsMethodChecks)
  console.log('Weapp runtime smoke: PASS')
}

main()
