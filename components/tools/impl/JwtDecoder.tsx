'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, ShieldAlert } from 'lucide-react'
import { CopyButton, ToolTextarea } from '../ui'

function b64urlDecode(part: string): string {
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=')
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

function pretty(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2)
  } catch {
    return json
  }
}

function claimTime(payload: string, key: string): string | null {
  try {
    const v = JSON.parse(payload)[key]
    if (typeof v !== 'number') return null
    return new Date(v * 1000).toUTCString()
  } catch {
    return null
  }
}

export function JwtDecoder() {
  const [token, setToken] = useState('')

  const decoded = useMemo(() => {
    if (!token.trim()) return null
    const parts = token.trim().split('.')
    if (parts.length < 2) return { error: 'A JWT has at least two dot-separated parts.' }
    try {
      const header = pretty(b64urlDecode(parts[0]))
      const payload = b64urlDecode(parts[1])
      return {
        header,
        payload: pretty(payload),
        iat: claimTime(payload, 'iat'),
        exp: claimTime(payload, 'exp'),
        expired: (() => {
          try {
            const exp = JSON.parse(payload).exp
            return typeof exp === 'number' ? exp * 1000 < Date.now() : null
          } catch {
            return null
          }
        })(),
      }
    } catch {
      return { error: 'Could not decode this token.' }
    }
  }, [token])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground">JWT</label>
        <button
          onClick={() => setToken(SAMPLE)}
          className="rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted/70"
        >
          Sample
        </button>
      </div>
      <ToolTextarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste a JSON Web Token…"
        className="min-h-28"
      />

      <p className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
        <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
        Signature is not verified — decoding happens locally and never checks the secret.
      </p>

      {decoded && 'error' in decoded && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {decoded.error}
        </p>
      )}

      {decoded && !('error' in decoded) && (
        <>
          {(decoded.iat || decoded.exp) && (
            <div className="flex flex-wrap gap-2 text-xs">
              {decoded.iat && (
                <span className="rounded-lg bg-muted px-2.5 py-1">Issued: {decoded.iat}</span>
              )}
              {decoded.exp && (
                <span
                  className={`rounded-lg px-2.5 py-1 ${
                    decoded.expired ? 'bg-destructive/15 text-destructive' : 'bg-ufo-green/10 text-ufo-green'
                  }`}
                >
                  {decoded.expired ? 'Expired' : 'Expires'}: {decoded.exp}
                </span>
              )}
            </div>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground">Header</label>
                <CopyButton value={decoded.header} />
              </div>
              <ToolTextarea value={decoded.header} readOnly className="min-h-40" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground">Payload</label>
                <CopyButton value={decoded.payload} />
              </div>
              <ToolTextarea value={decoded.payload} readOnly className="min-h-40" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
