const setCollapsibleState = (element) => {
  element.setAttribute('data-state', element.open ? 'open' : 'closed')
}

export function initCollapsible(root = document) {
  const collapsibles = Array.from(root.querySelectorAll('[data-slot="collapsible"]'))
  collapsibles.forEach((collapsible) => {
    if (collapsible.dataset.bound === 'true') return
    collapsible.dataset.bound = 'true'
    setCollapsibleState(collapsible)
    collapsible.addEventListener('toggle', () => {
      setCollapsibleState(collapsible)
    })
  })
}
