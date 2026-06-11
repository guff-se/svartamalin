// Server-side Supabase REST helper (Cloudflare Pages Functions).

export async function validateGuestLogin(slug, env) {
  const url = env.SUPABASE_URL
  const key = env.SUPABASE_ANON_KEY
  if (!url || !key) return null

  const res = await fetch(`${url}/rest/v1/rpc/validate_guest_login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ p_slug: slug }),
  })

  if (!res.ok) return null
  const guestId = await res.json()
  return guestId || null
}
