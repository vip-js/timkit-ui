const setTooltipState = (root, content, open) => {
  root.setAttribute('data-state', open ? 'open' : 'closed')
  content.setAttribute('data-state', open ? 'open' : 'closed')
  content.hidden = !open
  content.classList.toggle('hidden', !open)
}

export function initTooltip(root = document) {
  const tooltips = Array.from(root.querySelectorAll('[data-slot="tooltip-root"]'))
  tooltips.forEach((tooltip) => {
    if (tooltip.dataset.bound === 'true') return
    const trigger = tooltip.querySelector('[data-slot="tooltip-trigger"]')
    const content = tooltip.querySelector('[data-slot="tooltip-content"]')
    if (!trigger || !content) return

    tooltip.dataset.bound = 'true'
    let open = false
    let hideTimer

    const show = () => {
      clearTimeout(hideTimer)
      open = true
      setTooltipState(tooltip, content, open)
    }

    const hide = () => {
      clearTimeout(hideTimer)
      hideTimer = setTimeout(() => {
        open = false
        setTooltipState(tooltip, content, open)
      }, 80)
    }

    setTooltipState(tooltip, content, open)

    trigger.addEventListener('pointerenter', show)
    trigger.addEventListener('focus', show)
    trigger.addEventListener('pointerleave', hide)
    trigger.addEventListener('blur', hide)
    content.addEventListener('pointerenter', show)
    content.addEventListener('pointerleave', hide)
  })
}
