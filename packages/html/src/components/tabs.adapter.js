const activateTab = (tabs, index) => {
  const triggers = Array.from(tabs.querySelectorAll('[data-slot="tabs-trigger"]'))
  const contents = Array.from(tabs.querySelectorAll('[data-slot="tabs-content"]'))
  triggers.forEach((trigger, triggerIndex) => {
    const active = triggerIndex === index
    trigger.setAttribute('data-state', active ? 'active' : 'inactive')
    trigger.setAttribute('aria-selected', active ? 'true' : 'false')
    trigger.tabIndex = active ? 0 : -1
  })
  contents.forEach((content, contentIndex) => {
    const active = contentIndex === index
    content.setAttribute('data-state', active ? 'active' : 'inactive')
    content.hidden = !active
    content.classList.toggle('hidden', !active)
  })
}

export function initTabs(root = document) {
  const tabsRoots = Array.from(root.querySelectorAll('[data-slot="tabs"]'))
  tabsRoots.forEach((tabs) => {
    if (tabs.dataset.bound === 'true') return
    tabs.dataset.bound = 'true'

    const triggers = Array.from(tabs.querySelectorAll('[data-slot="tabs-trigger"]'))
    const initialIndex = Math.max(
      triggers.findIndex((trigger) => trigger.getAttribute('data-state') === 'active'),
      0
    )

    activateTab(tabs, initialIndex)

    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => {
        activateTab(tabs, index)
      })
    })
  })
}
