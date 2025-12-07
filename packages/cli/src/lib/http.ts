type RetryOptions = {
  retries?: number
  timeoutMs?: number
  backoffMs?: number
}

const DEFAULT_RETRIES = 2
const DEFAULT_TIMEOUT = 10_000
const DEFAULT_BACKOFF = 500

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(id)
  }
}

export async function fetchJsonWithRetry<T = any>(
  url: string,
  opts: RetryOptions = {}
): Promise<T> {
  const retries = opts.retries ?? DEFAULT_RETRIES
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT
  const backoffMs = opts.backoffMs ?? DEFAULT_BACKOFF

  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, timeoutMs)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      return (await res.json()) as T
    } catch (e) {
      lastError = e
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, backoffMs * (attempt + 1)))
      }
    }
  }
  throw lastError ?? new Error(`Failed to fetch ${url}`)
}

export async function fetchTextWithRetry(
  url: string,
  opts: RetryOptions = {}
): Promise<string> {
  const retries = opts.retries ?? DEFAULT_RETRIES
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT
  const backoffMs = opts.backoffMs ?? DEFAULT_BACKOFF

  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, timeoutMs)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      return await res.text()
    } catch (e) {
      lastError = e
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, backoffMs * (attempt + 1)))
      }
    }
  }
  throw lastError ?? new Error(`Failed to fetch ${url}`)
}
