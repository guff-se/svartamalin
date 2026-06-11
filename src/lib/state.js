// Klient-state för aktuell gäst. guest_id sätts vid inloggning (personligt lösenord).
const GUEST_KEY = 'svartamalin:guest_id'
const PEEK_KEY = 'svartamalin:peek'

export function getGuestId() {
  return localStorage.getItem(GUEST_KEY)
}

export function setGuestId(id) {
  localStorage.setItem(GUEST_KEY, id)
}

export function clearGuestId() {
  localStorage.removeItem(GUEST_KEY)
}

export function isPeekMode() {
  return localStorage.getItem(PEEK_KEY) === '1'
}

export function setPeekMode(on = true) {
  if (on) localStorage.setItem(PEEK_KEY, '1')
  else localStorage.removeItem(PEEK_KEY)
}

export function clearSession() {
  clearGuestId()
  localStorage.removeItem('svartamalin:unlocked')
  setPeekMode(false)
}
