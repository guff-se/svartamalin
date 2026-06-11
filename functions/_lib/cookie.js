// Enkel HMAC-signerad cookie med Web Crypto (tillgänglig i Cloudflare Workers runtime).

export const COOKIE_NAME = 'sm_pass'
export const ADMIN_COOKIE_NAME = 'sm_admin'
const MAX_AGE_DAYS = 120

const encoder = new TextEncoder()

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function b64url(bytes) {
  let s = btoa(String.fromCharCode(...new Uint8Array(bytes)))
  return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  const bin = atob(str)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return arr
}

export async function signValue(value, secret) {
  const key = await hmacKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return `${value}.${b64url(sig)}`
}

export async function verifyValue(token, secret) {
  if (!token || !token.includes('.')) return false
  const idx = token.lastIndexOf('.')
  const value = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  try {
    const key = await hmacKey(secret)
    return await crypto.subtle.verify('HMAC', key, fromB64url(sig), encoder.encode(value))
  } catch {
    return false
  }
}

function parseCookies(header) {
  const out = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    out[k] = decodeURIComponent(v.join('='))
  }
  return out
}

export async function verifyCookie(cookieHeader, secret, name = COOKIE_NAME) {
  if (!secret) return false
  const cookies = parseCookies(cookieHeader)
  const token = cookies[name]
  if (!token) return false
  return verifyValue(token, secret)
}

export function setCookieHeader(name, token) {
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60
  return `${name}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
}
