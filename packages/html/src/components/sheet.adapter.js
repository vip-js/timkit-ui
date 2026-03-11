const setSheetState = (root, open) => {
  const overlay = root.querySelector('[data-slot="sheet-overlay"]')
  const content = root.querySelector('[data-slot="sheet-content"]')
  const trigger = root.querySelector('[data-slot="sheet-trigger"]')

  root.setAttribute('data-state', open ? 'open' : 'closed')
  trigger?.setAttribute('aria-expanded', open ? 'true' : 'false')

  if (overlay) {
    overlay.setAttribute('data-state', open ? 'open' : 'closed')
    overlay.hidden = !open
    overlay.classList.toggle('hidden', !open)
  }

  if (content) {
    content.setAttribute('data-state', open ? 'open' : 'closed')
    content.hidden = !open
    content.classList.toggle('hidden', !open)
  }
}

export function initSheet(root = document) {
  const sheets = Array.from(root.querySelectorAll('[data-slot="sheet-root"]'))
  sheets.forEach((sheet) => {
    if (sheet.dataset.bound === 'true') return
    sheet.dataset.bound = 'true'

    const trigger = sheet.querySelector('[data-slot="sheet-trigger"]')
    const overlay = sheet.querySelector('[data-slot="sheet-overlay"]')
    const closeButtons = Array.from(sheet.querySelectorAll('[data-slot="sheet-close"]'))
    if (!trigger) return

    let open = sheet.getAttribute('data-state') === 'open'
    setSheetState(sheet, open)

    trigger.addEventListener('click', () => {
      open = !open
      setSheetState(sheet, open)
    })

    overlay?.addEventListener('click', () => {
      open = false
      setSheetState(sheet, open)
    })

    closeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        open = false
        setSheetState(sheet, open)
      })
    })

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        open = false
        setSheetState(sheet, open)
      }
    })
  })
}
