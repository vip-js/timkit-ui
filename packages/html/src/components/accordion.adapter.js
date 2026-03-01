import { createGuards } from '@zag-js/core'
import { accordionMachine } from '@timui/core'

const toArray = (value) => {
  if (value == null) return []
  return Array.isArray(value) ? value : value === '' ? [] : [value]
}

const getItemValue = (item, index) => item.getAttribute('data-value') || `item-${index + 1}`

const getDefaultValue = (items) => {
  const openItems = items.filter((item) => item.getAttribute('data-state') === 'open')
  return openItems.map((item, index) => getItemValue(item, index))
}

function createDomMachine(machine, props, onUpdate) {
  let rawProps = { ...props }
  let resolvedProps =
    typeof machine.props === 'function' ? machine.props({ props: rawProps }) : rawProps

  const prop = (key) => resolvedProps[key]
  const { and, not, or } = createGuards()
  const guardImpl = {
    ...machine.implementations?.guards,
    and,
    or,
    not,
  }

  const bindable = (getParams) => {
    const params = getParams()
    const initial = params.value ?? params.defaultValue
    let current = initial
    return {
      get: () => current,
      set: (next) => {
        const prev = current
        current = typeof next === 'function' ? next(prev) : next
        if (params.onChange && current !== prev) {
          params.onChange(current, prev)
        }
      },
      initial,
      hash: (value) => (params.hash ? params.hash(value) : String(value)),
    }
  }

  let contextEntries =
    typeof machine.context === 'function'
      ? machine.context({ prop, bindable })
      : machine.context || {}

  let currentState =
    typeof machine.initialState === 'function'
      ? machine.initialState({ prop })
      : machine.initialState || machine.initial || 'idle'

  const ctx = {
    get: (key) => {
      const entry = contextEntries[key]
      return entry?.get ? entry.get() : entry
    },
    set: (key, value) => {
      const entry = contextEntries[key]
      if (entry?.set) entry.set(value)
      else contextEntries[key] = value
    },
  }

  const getParams = (event) => ({
    state: { matches: (...values) => values.includes(currentState) },
    context: ctx,
    event,
    prop,
    send,
    action,
    guard,
    choose,
  })

  function guard(guardOrFn, event) {
    if (!guardOrFn) return true
    if (typeof guardOrFn === 'function') {
      return guardOrFn(getParams(event))
    }
    const fn = guardImpl?.[guardOrFn]
    return fn ? fn(getParams(event)) : false
  }

  function choose(transitions, event) {
    if (!transitions) return null
    const list = Array.isArray(transitions) ? transitions : [transitions]
    return list.find((transition) => {
      if (!transition) return false
      if (typeof transition === 'string') return true
      if (!transition.guard) return true
      return guard(transition.guard, event)
    })
  }

  function action(actions, event) {
    if (!actions) return
    const list = Array.isArray(actions) ? actions : [actions]
    list.forEach((actionName) => {
      if (!actionName) return
      if (typeof actionName === 'function') {
        actionName(getParams(event))
        return
      }
      const fn = machine.implementations?.actions?.[actionName]
      fn?.(getParams(event))
    })
  }

  function send(event) {
    const evt = typeof event === 'string' ? { type: event } : event
    const transitions = machine.states?.[currentState]?.on?.[evt.type] || machine.on?.[evt.type]
    const transition = choose(transitions, evt)
    if (!transition) return

    if (typeof transition === 'string') {
      currentState = transition
      onUpdate?.()
      return
    }

    if (transition.target) {
      currentState = transition.target
    }
    action(transition.actions, evt)
    onUpdate?.()
  }

  return { send, ctx }
}

export function initAccordion(root = document) {
  const accordions = Array.from(root.querySelectorAll('[data-slot="accordion"]'))
  accordions.forEach((accordion) => {
    const items = Array.from(accordion.querySelectorAll('[data-slot="accordion-item"]'))
    if (!items.length) return

    const type = accordion.getAttribute('data-type') || 'single'
    const multiple = type === 'multiple'
    const collapsible = accordion.getAttribute('data-collapsible') === 'true'
    const defaultValue = getDefaultValue(items)

    const machine = createDomMachine(
      accordionMachine,
      {
        multiple,
        collapsible,
        value: defaultValue,
        defaultValue,
      },
      () => updateDom(items, machine)
    )

    updateDom(items, machine)

    items.forEach((item, index) => {
      const trigger = item.querySelector('[data-slot="accordion-trigger"]')
      if (!trigger) return
      if (trigger.dataset.bound) return
      trigger.dataset.bound = 'true'

      const value = getItemValue(item, index)
      trigger.addEventListener('click', () => {
        machine.send({ type: 'TRIGGER.FOCUS', value })
        machine.send({ type: 'TRIGGER.CLICK', value })
      })
    })
  })
}

function updateDom(items, machine) {
  const value = toArray(machine.ctx.get('value'))
  items.forEach((item, index) => {
    const itemValue = getItemValue(item, index)
    const expanded = value.includes(itemValue)
    const trigger = item.querySelector('[data-slot="accordion-trigger"]')
    const content = item.querySelector('[data-slot="accordion-content"]')

    item.setAttribute('data-state', expanded ? 'open' : 'closed')
    if (trigger) {
      trigger.setAttribute('data-state', expanded ? 'open' : 'closed')
      trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false')
    }
    if (content) {
      content.setAttribute('data-state', expanded ? 'open' : 'closed')
      content.toggleAttribute('hidden', !expanded)
      if (expanded) {
        content.classList.remove('hidden')
      } else {
        content.classList.add('hidden')
      }
    }
  })
}
