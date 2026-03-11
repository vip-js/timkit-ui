const setDropdownState = (trigger, content, open) => {
  trigger.setAttribute('aria-expanded', open ? 'true' : 'false')
  trigger.setAttribute('data-state', open ? 'open' : 'closed')
  content.setAttribute('data-state', open ? 'open' : 'closed')
  content.hidden = !open
  content.classList.toggle('hidden', !open)
}

export function initDropdownMenu(root = document) {
  const menus = Array.from(root.querySelectorAll('[data-slot="dropdown-menu-trigger"]'))
  menus.forEach((trigger) => {
    if (trigger.dataset.bound === 'true') return
    const wrapper = trigger.closest('div')
    const content = wrapper?.querySelector('[data-slot="dropdown-menu-content"]')
    if (!wrapper || !content) return

    trigger.dataset.bound = 'true'
    const items = Array.from(content.querySelectorAll('[data-slot="dropdown-menu-item"]'))
    let open = trigger.getAttribute('aria-expanded') === 'true'
    setDropdownState(trigger, content, open)

    trigger.addEventListener('click', () => {
      open = !open
      setDropdownState(trigger, content, open)
    })

    items.forEach((item) => {
      item.addEventListener('click', () => {
        open = false
        setDropdownState(trigger, content, open)
      })
    })

    document.addEventListener('click', (event) => {
      if (!wrapper.contains(event.target)) {
        open = false
        setDropdownState(trigger, content, open)
      }
    })

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        open = false
        setDropdownState(trigger, content, open)
      }
    })
  })
}
