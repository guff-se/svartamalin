/**
 * Image generation/editing via ChatGPT subscription (Codex OAuth).
 * Uses ~/.codex/auth.json from `codex login` — no OPENAI_API_KEY billing.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

const CODEX_BACKEND = 'https://chatgpt.com/backend-api/codex/responses'
const OAUTH_TOKEN_URL = 'https://auth.openai.com/oauth/token'
const OAUTH_CLIENT_ID = 'app_EMoamEEZ73f0CkXaXp7hrann'
const FALLBACK_VERSION = '0.130.0'
const DEFAULT_STALL_MS = 120_000
const DEFAULT_TOTAL_MS = 300_000

function codexHome() {
  return process.env.CODEX_HOME || join(homedir(), '.codex')
}

function authPath() {
  return join(codexHome(), 'auth.json')
}

function versionPath() {
  return join(codexHome(), 'version.json')
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}

export async function hasCodexSubscriptionAuth() {
  try {
    const auth = await readJson(authPath())
    return Boolean(auth.tokens?.access_token)
  } catch {
    return false
  }
}

async function detectCodexVersion() {
  try {
    const data = await readJson(versionPath())
    if (typeof data.latest_version === 'string') return data.latest_version
  } catch {
    /* use fallback */
  }
  return FALLBACK_VERSION
}

async function refreshAccessToken(refreshToken) {
  const res = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: OAUTH_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      scope: 'openid profile email',
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = data.error === 'invalid_grant'
      ? 'Codex session expired — run `codex login` again.'
      : `Token refresh failed: HTTP ${res.status}`
    throw new Error(err)
  }
  return data
}

async function persistRefreshedAuth(original, refreshed) {
  const next = structuredClone(original)
  next.tokens ??= {}
  if (refreshed.access_token) next.tokens.access_token = refreshed.access_token
  if (refreshed.refresh_token) next.tokens.refresh_token = refreshed.refresh_token
  if (refreshed.id_token) next.tokens.id_token = refreshed.id_token
  next.last_refresh = new Date().toISOString()
  await writeFile(authPath(), `${JSON.stringify(next, null, 2)}\n`, { mode: 0o600 })
  return next
}

async function loadAuth() {
  let auth
  try {
    auth = await readJson(authPath())
  } catch {
    throw new Error('~/.codex/auth.json not found. Run `codex login` (ChatGPT sign-in) first.')
  }

  const access = auth.tokens?.access_token
  const refresh = auth.tokens?.refresh_token
  if (!access) {
    throw new Error('No Codex OAuth token found. Run `codex login` with your ChatGPT account.')
  }

  return { auth, access, accountId: auth.tokens?.account_id ?? null, refresh }
}

function buildHeaders(token, accountId, version) {
  const sid = randomUUID()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    Accept: 'text/event-stream',
    Connection: 'Keep-Alive',
    version,
    session_id: sid,
    'x-client-request-id': sid,
    originator: 'codex_cli_rs',
    ...(accountId ? { 'chatgpt-account-id': accountId } : {}),
  }
}

function buildEditPayload({ prompt, imageDataUrl, size, outputFormat, model }) {
  const userText = [
    'Use the image_generation tool to edit the input image.',
    prompt,
    `Size: ${size}.`,
    `Output format: ${outputFormat}.`,
    'Produce only the image — no explanatory text.',
  ].join(' ')

  const imageTool = {
    type: 'image_generation',
    action: 'edit',
    output_format: outputFormat,
    size,
  }

  return {
    model,
    stream: true,
    instructions: 'You are an image generation assistant.',
    input: [
      {
        type: 'message',
        role: 'user',
        content: [
          { type: 'input_text', text: userText },
          { type: 'input_image', image_url: imageDataUrl },
        ],
      },
    ],
    tools: [imageTool],
    tool_choice: 'auto',
    parallel_tool_calls: false,
    store: false,
    reasoning: { effort: 'low', summary: 'auto' },
    include: ['reasoning.encrypted_content'],
    text: { verbosity: 'low' },
  }
}

async function* parseSseStream(response, deadline) {
  const decoder = new TextDecoder()
  let pending = ''
  let dataBuf = []

  for await (const chunk of response.body) {
    if (Date.now() >= deadline) throw new Error('Codex image request timed out')

    pending += decoder.decode(chunk, { stream: true })
    const lines = pending.split('\n')
    pending = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.replace(/\r$/, '')
      if (trimmed === '') {
        if (!dataBuf.length) continue
        const payload = dataBuf.join('\n')
        dataBuf = []
        if (payload === '[DONE]') return
        try {
          yield JSON.parse(payload)
        } catch {
          /* skip malformed */
        }
        continue
      }
      if (trimmed.startsWith('data:')) {
        let chunkData = trimmed.slice(5)
        if (chunkData.startsWith(' ')) chunkData = chunkData.slice(1)
        dataBuf.push(chunkData)
      }
    }
  }
}

async function postForImage({ payload, headers, totalMs = DEFAULT_TOTAL_MS, stallMs = DEFAULT_STALL_MS }) {
  const deadline = Date.now() + totalMs
  const res = await fetch(CODEX_BACKEND, { method: 'POST', headers, body: JSON.stringify(payload) })

  if (!res.ok) {
    const text = await res.text()
    const err = new Error(`Codex image request failed: HTTP ${res.status} ${text.slice(0, 400)}`)
    err.status = res.status
    throw err
  }

  let imageB64 = null
  let lastPhase = 'connecting'
  let lastEventAt = Date.now()

  for await (const evt of parseSseStream(res, deadline)) {
    lastEventAt = Date.now()
    const type = evt.type ?? ''

    if (type === 'response.image_generation_call.in_progress') lastPhase = 'queued'
    else if (type === 'response.image_generation_call.generating') lastPhase = 'generating'
    else if (type === 'response.image_generation_call.partial_image') lastPhase = 'receiving image'
    else if (type === 'response.output_item.done' && evt.item?.type === 'image_generation_call' && evt.item.result) {
      imageB64 = evt.item.result
    } else if (type === 'error' || evt.error) {
      const msg = evt.error?.message || evt.message || JSON.stringify(evt)
      throw new Error(`Codex image error: ${msg}`)
    }

    if (Date.now() - lastEventAt > stallMs) {
      throw new Error(`Codex image backend stalled during "${lastPhase}"`)
    }
  }

  if (!imageB64) throw new Error('Codex returned no image data')
  return Buffer.from(imageB64, 'base64')
}

/**
 * Edit an image using ChatGPT subscription quota (Codex OAuth).
 */
export async function editImageWithCodex({
  prompt,
  imageDataUrl,
  size = '1024x1536',
  outputFormat = 'jpeg',
  model = process.env.CODEX_IMAGE_MODEL || 'gpt-5.5',
}) {
  let { auth, access, accountId, refresh } = await loadAuth()
  const version = await detectCodexVersion()
  const payload = buildEditPayload({ prompt, imageDataUrl, size, outputFormat, model })

  try {
    return await postForImage({
      payload,
      headers: buildHeaders(access, accountId, version),
    })
  } catch (err) {
    if (!refresh || err.status !== 401) throw err
    const refreshed = await refreshAccessToken(refresh)
    auth = await persistRefreshedAuth(auth, refreshed)
    access = auth.tokens.access_token
    return postForImage({
      payload,
      headers: buildHeaders(access, accountId, version),
    })
  }
}
