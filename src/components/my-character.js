import { supabase } from '../lib/supabase.js'
import { getGuestId } from '../lib/state.js'
import { escapeHtml } from '../lib/escape.js'
import { portraitPath } from '../lib/portraits.js'
import { overlayForGuest } from '../lib/card-frame-assignments.js'
import { pirateCardHtml } from './pirate-card.js'
import { makeCardsInteractive, wirePirateCardGrid } from './crew-collage.js'

const FIELDS = [
  {
    col: 'character_facts',
    label: 'Berätta om karaktären du vill spela',
    placeholder: 't.ex. din största hemlighet, vad som kan vinna ditt hjärta, vad du är rädd för',
  },
  {
    col: 'character_object',
    label: 'Berätta om ett speciellt objekt du kommer ha med dig',
    placeholder: 't.ex. en prejat halsband, ett hemlig karta. Något som någon annan kan fatta tycke för.',
  },
  {
    col: 'character_skill',
    label: 'Dela en färdighet du har, eller en aktivitet du vill engagera dig i under festen',
    placeholder: 't.ex. spela dragspel, grilla kött, sexmagick…',
  },
  {
    col: 'character_play_with',
    label: 'Finns det någon intrig, nån hemlig information eller bakgrundsberättelse, som du vill att en annan deltagare skall få.',
    placeholder: 't.ex. Att fråga om din rituella fotmassage, misstänka att ditt skägg är oäkta',
  },
]

/**
 * "Din karaktär" — gästens eget underlag till intrigerna.
 * Döljer hela section om gästen inte är inloggad/påmönstrad, eller om
 * character-kolumnerna ännu inte finns i databasen.
 * @param {HTMLElement} el  — #my-character card
 */
export async function renderMyCharacter(el) {
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

  const columns = ['id', 'real_name', 'attending', 'pirate_name_id', ...FIELDS.map((f) => f.col)]
  const { data: me, error } = await supabase
    .from('guests')
    .select(columns.join(', '))
    .eq('id', guestId)
    .maybeSingle()

  // Migrationen (supabase/migrations/add-character-fields.sql) inte körd än.
  if (error && /character_/.test(error.message ?? '')) {
    console.warn('Din karaktär: character-kolumner saknas i databasen — kör add-character-fields.sql')
    hide()
    return
  }
  if (error || !me || me.attending !== true) {
    hide()
    return
  }

  const { data: pname } = me.pirate_name_id
    ? await supabase.from('pirate_names').select('name').eq('id', me.pirate_name_id).maybeSingle()
    : { data: null }

  if (section) section.hidden = false
  el.innerHTML = `
    <h2>Din karaktär</h2>
    <div class="character-hero">
      ${pirateCardHtml({
        photoSrc: portraitPath(me.real_name),
        pirateName: pname?.name || me.real_name,
        overlaySrc: overlayForGuest({ id: me.id, pirate_name_id: me.pirate_name_id }),
      })}
    </div>
    <form id="character-form" class="info-form">
      ${FIELDS.map((f) => `
        <label class="info-field">
          <span>${escapeHtml(f.label)}</span>
          <textarea name="${f.col}" rows="3" placeholder="${escapeHtml(f.placeholder)}">${escapeHtml(me[f.col] ?? '')}</textarea>
        </label>
      `).join('')}
      <div class="row">
        <button type="submit">Spara</button>
      </div>
      <p class="info-saved" id="character-saved" hidden>Sparat ✓</p>
    </form>
  `

  const hero = el.querySelector('.character-hero')
  wirePirateCardGrid(hero)
  makeCardsInteractive(hero)

  const form = el.querySelector('#character-form')
  const saved = el.querySelector('#character-saved')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = form.querySelector('button[type="submit"]')
    btn.disabled = true
    saved.hidden = true

    const payload = {}
    FIELDS.forEach((f) => {
      payload[f.col] = form.elements[f.col].value.trim() || null
    })

    const { error: saveError } = await supabase.from('guests').update(payload).eq('id', guestId)
    btn.disabled = false
    if (saveError) {
      alert('Något gick fel: ' + saveError.message)
      return
    }
    saved.hidden = false
    setTimeout(() => { saved.hidden = true }, 2500)
  })
}
