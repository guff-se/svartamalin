import { supabase } from '../lib/supabase.js'
import { getGuestId } from '../lib/state.js'
import { getGuestIntriger, intrigerListHtml } from '../lib/intriger.js'

/**
 * Personliga intriger — egen card under lag-sektionen.
 * Döljer hela section om det inte finns något att visa.
 * @param {HTMLElement} el  — #my-intriger card
 */
export async function renderMyIntriger(el) {
  const section = el.closest('.card-section')
  const hide = () => {
    el.innerHTML = ''
    if (section) section.hidden = true
  }

  const guestId = getGuestId()
  if (!guestId) {
    hide()
    return
  }

  const { data: me } = await supabase
    .from('guests')
    .select('login_slug')
    .eq('id', guestId)
    .maybeSingle()

  const intrigues = getGuestIntriger(me?.login_slug)
  if (!intrigues.length) {
    hide()
    return
  }

  if (section) section.hidden = false
  el.innerHTML = `
    <h2>Dina intriger</h2>
    ${intrigerListHtml(intrigues)}
  `
}
