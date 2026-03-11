const setToastState = (toast, open) => {
  toast.setAttribute('data-state', open ? 'open' : 'closed')
  toast.hidden = !open
  toast.classList.toggle('hidden', !open)
}

export function initToast(root = document) {
  const toasts = Array.from(root.querySelectorAll('[data-slot="toast"]'))
  toasts.forEach((toast) => {
    if (toast.dataset.bound === 'true') return
    const close = toast.querySelector('[data-slot="toast-close"]')
    if (!close) return

    toast.dataset.bound = 'true'
    setToastState(toast, true)

    close.addEventListener('click', () => {
      setToastState(toast, false)
    })
  })
}
