const setToggleState = (toggle, pressed) => {
  toggle.setAttribute('aria-pressed', pressed ? 'true' : 'false')
  toggle.setAttribute('data-state', pressed ? 'on' : 'off')
}

export function initToggle(root = document) {
  const toggles = Array.from(root.querySelectorAll('[data-slot="toggle"]'))
  toggles.forEach((toggle) => {
    if (toggle.dataset.bound === 'true') return
    toggle.dataset.bound = 'true'

    let pressed =
      toggle.getAttribute('aria-pressed') === 'true' || toggle.getAttribute('data-state') === 'on'
    setToggleState(toggle, pressed)

    toggle.addEventListener('click', () => {
      pressed = !pressed
      setToggleState(toggle, pressed)
    })
  })
}
