// Gatekeepar känsliga assets (musik etc) bakom party-cookien.
// HTML/JS/CSS är öppet — klienten visar lösenordsskärmen tills man låst upp.
// Faktiska gästdata skyddas av Supabase RLS.

import { verifyCookie, COOKIE_NAME } from './_lib/cookie.js'

const GATED_PATHS = [] // musik och kartdata är inte hemligt — RLS skyddar gästdata

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url)
  const gated = GATED_PATHS.some((p) => url.pathname.startsWith(p))
  if (!gated) return next()

  const ok = await verifyCookie(request.headers.get('Cookie'), env.COOKIE_SECRET, COOKIE_NAME)
  if (ok) return next()

  return new Response('Locked', { status: 403 })
}
