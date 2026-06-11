// Visa/dölj load-screenen ovanpå appen. Fade-out tar 700 ms.
export function showLoading() {
  const el = document.getElementById('loading-screen')
  if (!el) return
  el.classList.remove('fading')
  el.hidden = false
}

export function hideLoading() {
  const el = document.getElementById('loading-screen')
  if (!el) return
  el.classList.add('fading')
  setTimeout(() => { el.hidden = true }, 700)
}
