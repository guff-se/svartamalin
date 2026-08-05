import { bindMuteButton, primeAudioAutoplay } from '../lib/audio.js'
import { supabase } from '../lib/supabase.js'
import { setGuestId } from '../lib/state.js'

export function renderUnlock(app, onUnlocked) {
  app.innerHTML = `
    <section class="unlock">
      <form id="unlock-form">
        <input
          id="password"
          type="text"
          placeholder="Lösenord"
          autocomplete="off"
          autocapitalize="none"
          autocorrect="off"
          spellcheck="false"
        />
        <button type="submit">Stig ombord</button>
        <p class="error" id="unlock-error"></p>
      </form>
      <p class="audio-hint">
        <button type="button" class="audio-hint__mute" aria-label="Stäng av ljud">🔊</button>
        Ljud rekommenderas
      </p>
    </section>
  `

  const form = document.getElementById('unlock-form')
  const input = document.getElementById('password')
  const error = document.getElementById('unlock-error')
  bindMuteButton(app.querySelector('.audio-hint__mute'))

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    error.textContent = ''

    // Lås upp autoplay i samma user gesture — musiken startar först vid reveal.
    primeAudioAutoplay()

    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input.value }),
      })
      // I dev-läge (vite dev utan wrangler) — validera via Supabase RPC.
      if (res.status === 404 && import.meta.env.DEV) {
        const slug = input.value.trim().toLowerCase()
        const { data: guestId } = await supabase.rpc('validate_guest_login', { p_slug: slug })
        if (!guestId) {
          form.classList.remove('shake')
          void form.offsetWidth
          form.classList.add('shake')
          error.textContent = 'Avvisad. Försök igen.'
          input.value = ''
          input.focus()
          return
        }
        setGuestId(guestId)
        onUnlocked()
        return
      }
      if (!res.ok) {
        form.classList.remove('shake')
        // reflow så animationen kan triggas igen
        void form.offsetWidth
        form.classList.add('shake')
        error.textContent = 'Avvisad. Försök igen.'
        input.value = ''
        input.focus()
        return
      }
      const data = await res.json()
      if (data.guest_id) setGuestId(data.guest_id)
      onUnlocked()
    } catch (err) {
      error.textContent = 'Något gick fel. Försök igen.'
    }
  })
}
