import { supabase } from './supabase.js'
import { getGuestId } from './state.js'

/** Fire-and-forget: logga inloggning eller Sätt segel-klick. */
export function logVisit(source) {
  const guestId = getGuestId()
  if (!guestId) return
  supabase
    .rpc('log_guest_visit', { p_guest_id: guestId, p_source: source })
    .then(({ error }) => {
      if (error) console.warn('log_guest_visit', error.message)
    })
}
