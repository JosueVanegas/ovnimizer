// Pure JSON transforms shared by the JSON-category tools. No dependencies.

export type Json = null | boolean | number | string | Json[] | { [k: string]: Json }

export function tryParse(text: string): { value: Json; error: null } | { value: null; error: string } {
  try {
    return { value: JSON.parse(text) as Json, error: null }
  } catch (e) {
    return { value: null, error: (e as Error).message }
  }
}

const isObject = (v: unknown): v is Record<string, Json> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)
const isContainer = (v: unknown) => Array.isArray(v) || isObject(v)
const isEmpty = (v: Json) => (Array.isArray(v) ? v.length === 0 : isObject(v) && Object.keys(v).length === 0)

// ---- YAML ------------------------------------------------------------------

function yamlScalar(v: Json): string {
  if (v === null) return 'null'
  if (typeof v === 'boolean' || typeof v === 'number') return String(v)
  const s = String(v)
  if (s === '') return '""'
  if (/[:#[\]{}",&*!|>%@`]/.test(s) || /^\s|\s$/.test(s) || /\n/.test(s) || /^(true|false|null|~|-?\d)/i.test(s)) {
    return JSON.stringify(s)
  }
  return s
}

function inlineOrScalar(v: Json): string {
  if (isEmpty(v)) return Array.isArray(v) ? '[]' : '{}'
  return yamlScalar(v)
}

function yamlLines(value: Json, indent: number): string[] {
  const pad = '  '.repeat(indent)

  if (Array.isArray(value)) {
    if (value.length === 0) return [pad + '[]']
    const lines: string[] = []
    for (const item of value) {
      if (isContainer(item) && !isEmpty(item)) {
        const sub = yamlLines(item, indent + 1)
        lines.push(pad + '- ' + sub[0].slice((indent + 1) * 2))
        for (let i = 1; i < sub.length; i++) lines.push(sub[i])
      } else {
        lines.push(pad + '- ' + inlineOrScalar(item))
      }
    }
    return lines
  }

  if (isObject(value)) {
    const keys = Object.keys(value)
    if (keys.length === 0) return [pad + '{}']
    const lines: string[] = []
    for (const k of keys) {
      const val = value[k]
      if (isContainer(val) && !isEmpty(val)) {
        lines.push(pad + k + ':')
        lines.push(...yamlLines(val, indent + 1))
      } else {
        lines.push(pad + k + ': ' + inlineOrScalar(val))
      }
    }
    return lines
  }

  return [pad + yamlScalar(value)]
}

export function jsonToYaml(value: Json): string {
  return yamlLines(value, 0).join('\n')
}

// ---- CSV -------------------------------------------------------------------

function csvCell(v: Json | undefined): string {
  if (v === undefined || v === null) return ''
  if (isContainer(v)) return JSON.stringify(v)
  return String(v)
}

function csvEscape(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function jsonToCsv(data: Json): string {
  if (!Array.isArray(data)) throw new Error('Input must be a JSON array.')
  if (data.length === 0) return ''

  if (data.every((row) => isObject(row))) {
    const headers: string[] = []
    for (const row of data as Record<string, Json>[])
      for (const k of Object.keys(row)) if (!headers.includes(k)) headers.push(k)
    const lines = [headers.map(csvEscape).join(',')]
    for (const row of data as Record<string, Json>[]) {
      lines.push(headers.map((h) => csvEscape(csvCell(row[h]))).join(','))
    }
    return lines.join('\n')
  }

  return data.map((v) => csvEscape(csvCell(v))).join('\n')
}

// ---- TypeScript ------------------------------------------------------------

const pascal = (s: string) =>
  (s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('') || 'Anon')
const singular = (s: string) => s.replace(/s$/, '')

export function jsonToTypeScript(root: Json, rootName = 'Root'): string {
  const interfaces = new Map<string, string>()
  const used = new Set<string>()
  // Reuse one interface for structurally identical objects (e.g. array items).
  const bySignature = new Map<string, string>()

  function uniqueName(base: string): string {
    const b = pascal(base)
    let name = b
    let i = 2
    while (used.has(name)) name = b + i++
    used.add(name)
    return name
  }

  function typeOf(value: Json, hint: string): string {
    if (value === null) return 'null'
    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]'
      const types = Array.from(new Set(value.map((v) => typeOf(v, singular(hint)))))
      const joined = types.length === 1 ? types[0] : `(${types.join(' | ')})`
      return `${joined}[]`
    }
    if (isObject(value)) {
      const fields = Object.entries(value)
        .map(([k, v]) => {
          const key = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)
          return `  ${key}: ${typeOf(v, k)};`
        })
        .join('\n')
      const existing = bySignature.get(fields)
      if (existing) return existing
      const name = uniqueName(hint)
      bySignature.set(fields, name)
      interfaces.set(name, `export interface ${name} {\n${fields}\n}`)
      return name
    }
    return typeof value === 'string' ? 'string' : typeof value === 'number' ? 'number' : 'boolean'
  }

  const rootType = typeOf(root, rootName)
  const body = Array.from(interfaces.values()).reverse().join('\n\n')
  if (interfaces.has(rootType)) return body
  return `export type ${pascal(rootName)} = ${rootType};${body ? '\n\n' + body : ''}`
}

// ---- Diff ------------------------------------------------------------------

export interface DiffEntry {
  path: string
  type: 'added' | 'removed' | 'changed'
  before?: Json
  after?: Json
}

const eq = (a: Json, b: Json) => JSON.stringify(a) === JSON.stringify(b)

export function diffJson(a: Json, b: Json, path = '', out: DiffEntry[] = []): DiffEntry[] {
  if (eq(a, b)) return out

  if (isObject(a) && isObject(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const p = path ? `${path}.${k}` : k
      if (!(k in a)) out.push({ path: p, type: 'added', after: b[k] })
      else if (!(k in b)) out.push({ path: p, type: 'removed', before: a[k] })
      else diffJson(a[k], b[k], p, out)
    }
  } else if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const p = `${path}[${i}]`
      if (i >= a.length) out.push({ path: p, type: 'added', after: b[i] })
      else if (i >= b.length) out.push({ path: p, type: 'removed', before: a[i] })
      else diffJson(a[i], b[i], p, out)
    }
  } else {
    out.push({ path: path || '(root)', type: 'changed', before: a, after: b })
  }
  return out
}
