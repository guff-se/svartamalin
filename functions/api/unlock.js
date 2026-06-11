import { signValue, setCookieHeader, COOKIE_NAME } from '../_lib/cookie.js'
import { validateGuestLogin } from '../_lib/supabase.js'

export async function onRequestPost({ request, env }) {
  if (!env.COOKIE_SECRET) {
    return new Response(JSON.stringify({ error: 'Server is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  const submitted = (body?.password ?? '').toString().trim().toLowerCase()
  if (!submitted) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const guestId = await validateGuestLogin(submitted, env)
  if (!guestId) {
    await new Promise((r) => setTimeout(r, 500))
    return new Response(JSON.stringify({ ok: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const token = await signValue(`guest.${guestId}.${Date.now()}`, env.COOKIE_SECRET)
  return new Response(JSON.stringify({ ok: true, guest_id: guestId }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': setCookieHeader(COOKIE_NAME, token),
    },
  })
}
