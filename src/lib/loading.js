const LOADING_MESSAGES = [
  'Stiger ombord…',
  'Lättar ankar...',
  'Hissar segel...',
  'Kastar loss...',
]

// Visa/dölj load-screenen ovanpå appen. Fade-out tar 700 ms.
export function showLoading() {
  const el = document.getElementById('loading-screen')
  if (!el) return
  const textEl = el.querySelector('.loading-text')
  if (textEl) {
    textEl.textContent = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
  }
  el.classList.remove('fading')
  el.hidden = false
}

export function hideLoading() {
  const el = document.getElementById('loading-screen')
  if (!el) return
  el.classList.add('fading')
  setTimeout(() => { el.hidden = true }, 700)
}
