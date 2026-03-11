const setPopoverState = (root, trigger, content, open) => {
  root.setAttribute('data-state', open ? 'open' : 'closed')
  trigger.setAttribute('aria-expanded', open ? 'true' : 'false')
  trigger.setAttribute('data-state', open ? 'open' : 'closed')
  content.setAttribute('data-state', open ? 'open' : 'closed')
  content.hidden = !open
  content.classList.toggle('hidden', !open)
}

export function initPopover(root = document) {
  const popovers = Array.from(root.querySelectorAll('[data-slot="popover"]'))
  popovers.forEach((popover) => {
    if (popover.dataset.bound === 'true') return
    const trigger = popover.querySelector('[data-slot="popover-trigger"]')
    const content = popover.querySelector('[data-slot="popover-content"]')
    if (!trigger || !content) return

    popover.dataset.bound = 'true'
    let open = trigger.getAttribute('aria-expanded') === 'true'
    setPopoverState(popover, trigger, content, open)

    trigger.addEventListener('click', () => {
      open = !open
      setPopoverState(popover, trigger, content, open)
    })

    document.addEventListener('click', (event) => {
      if (!popover.contains(event.target)) {
        open = false
        setPopoverState(popover, trigger, content, open)
      }
    })

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        open = false
        setPopoverState(popover, trigger, content, open)
      }
    })
  })
}
