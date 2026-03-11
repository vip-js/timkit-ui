const setHoverCardState = (root, content, open) => {
  root.setAttribute('data-state', open ? 'open' : 'closed')
  content.setAttribute('data-state', open ? 'open' : 'closed')
  content.hidden = !open
  content.classList.toggle('hidden', !open)
}

export function initHoverCard(root = document) {
  const cards = Array.from(root.querySelectorAll('[data-slot="hover-card"]'))
  cards.forEach((card) => {
    if (card.dataset.bound === 'true') return
    const trigger = card.querySelector('[data-slot="hover-card-trigger"]')
    const content = card.querySelector('[data-slot="hover-card-content"]')
    if (!trigger || !content) return

    card.dataset.bound = 'true'
    let open = false
    let closeTimer

    const show = () => {
      clearTimeout(closeTimer)
      open = true
      setHoverCardState(card, content, open)
    }

    const hide = () => {
      clearTimeout(closeTimer)
      closeTimer = setTimeout(() => {
        open = false
        setHoverCardState(card, content, open)
      }, 80)
    }

    setHoverCardState(card, content, open)

    trigger.addEventListener('pointerenter', show)
    trigger.addEventListener('focus', show)
    trigger.addEventListener('pointerleave', hide)
    trigger.addEventListener('blur', hide)
    content.addEventListener('pointerenter', show)
    content.addEventListener('pointerleave', hide)
  })
}
