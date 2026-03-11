const setToggleGroupButtonState = (button, active) => {
  button.setAttribute('aria-pressed', active ? 'true' : 'false')
  button.setAttribute('data-state', active ? 'on' : 'off')
}

export function initToggleGroup(root = document) {
  const groups = Array.from(root.querySelectorAll('[data-slot="toggle-group"]'))
  groups.forEach((group) => {
    if (group.dataset.bound === 'true') return
    group.dataset.bound = 'true'

    const buttons = Array.from(group.querySelectorAll('button'))
    const multiple = group.getAttribute('data-type') === 'multiple'

    buttons.forEach((button) => {
      const active = button.getAttribute('data-state') === 'on'
      setToggleGroupButtonState(button, active)

      button.addEventListener('click', () => {
        if (multiple) {
          setToggleGroupButtonState(button, button.getAttribute('data-state') !== 'on')
          return
        }

        buttons.forEach((candidate) => {
          setToggleGroupButtonState(candidate, candidate === button)
        })
      })
    })
  })
}
