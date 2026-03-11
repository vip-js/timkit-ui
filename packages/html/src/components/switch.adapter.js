const setSwitchState = (control, thumb, input, checked) => {
  control.setAttribute('aria-checked', checked ? 'true' : 'false')
  control.setAttribute('data-state', checked ? 'checked' : 'unchecked')
  thumb?.setAttribute('data-state', checked ? 'checked' : 'unchecked')
  if (input) input.checked = checked
}

export function initSwitch(root = document) {
  const controls = Array.from(root.querySelectorAll('[data-slot="switch"]'))
  controls.forEach((control) => {
    if (control.dataset.bound === 'true') return
    const wrapper = control.closest('[data-slot="switch-root"]')
    const thumb = wrapper?.querySelector('[data-slot="switch-thumb"]')
    const input = wrapper?.querySelector('input[type="checkbox"]')
    if (!wrapper) return

    control.dataset.bound = 'true'
    let checked =
      control.getAttribute('aria-checked') === 'true' ||
      control.getAttribute('data-state') === 'checked' ||
      input?.checked === true

    setSwitchState(control, thumb, input, checked)

    control.addEventListener('click', () => {
      checked = !checked
      setSwitchState(control, thumb, input, checked)
      input?.dispatchEvent(new Event('change', { bubbles: true }))
    })
  })
}
