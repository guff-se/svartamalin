import { signValue, setCookieHeader, ADMIN_COOKIE_NAME } from '../_lib/cookie.js'

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD || !env.COOKIE_SECRET) {
    return new Response(JSON.stringify({ error: 'Server is not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  let body
  try { body = await request.json() } catch { return new Response('Bad request', { status: 400 }) }
  const submitted = (body?.password ?? '').toString().trim()
  if (submitted !== env.ADMIN_PASSWORD) {
    await new Promise((r) => setTimeout(r, 800))
    return new Response(JSON.stringify({ ok: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const token = await signValue(`admin.${Date.now()}`, env.COOKIE_SECRET)
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': setCookieHeader(ADMIN_COOKIE_NAME, token),
    },
  })
}
