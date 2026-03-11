const setNavigationMenuState = (item, open) => {
  const trigger = item.querySelector('[data-slot="navigation-menu-trigger"]')
  const content = item.querySelector('[data-slot="navigation-menu-content"]')
  if (!trigger || !content) return

  item.setAttribute('data-state', open ? 'open' : 'closed')
  trigger.setAttribute('aria-expanded', open ? 'true' : 'false')
  trigger.setAttribute('data-state', open ? 'open' : 'closed')
  content.setAttribute('data-state', open ? 'open' : 'closed')
  content.hidden = !open
  content.classList.toggle('hidden', !open)
}

export function initNavigationMenu(root = document) {
  const menus = Array.from(root.querySelectorAll('[data-slot="navigation-menu"]'))
  menus.forEach((menu) => {
    if (menu.dataset.bound === 'true') return
    menu.dataset.bound = 'true'

    const items = Array.from(menu.querySelectorAll('[data-slot="navigation-menu-item"]'))
    items.forEach((item) => {
      const trigger = item.querySelector('[data-slot="navigation-menu-trigger"]')
      const content = item.querySelector('[data-slot="navigation-menu-content"]')
      if (!trigger || !content) return

      let open = item.getAttribute('data-state') === 'open'
      setNavigationMenuState(item, open)

      trigger.addEventListener('click', () => {
        open = !open
        items.forEach((candidate) => {
          if (candidate !== item) setNavigationMenuState(candidate, false)
        })
        setNavigationMenuState(item, open)
      })
    })

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target)) {
        items.forEach((item) => setNavigationMenuState(item, false))
      }
    })
  })
}
