type FetchFileFn = (url: string, name?: string, headers?: Record<string, string>) => Promise<File>

function loadScript(src: string, id: string, attrs?: Record<string, string>): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve()
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) { resolve(); return }
    const s = document.createElement('script')
    s.id = id
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    if (attrs) Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v))
    document.head.appendChild(s)
  })
}

// ── Dropbox ──────────────────────────────────────────────────────────────────
export async function openDropboxPicker(
  fetchFile: FetchFileFn,
  onFiles: (files: File[]) => void,
): Promise<void> {
  const appKey = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY
  if (!appKey) throw new Error('env:NEXT_PUBLIC_DROPBOX_APP_KEY')

  await loadScript('https://www.dropbox.com/static/api/2/dropins.js', 'dropboxjs', {
    'data-app-key': appKey,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DB = (window as any).Dropbox
  if (!DB?.choose) throw new Error('Dropbox SDK not initialized')

  DB.choose({
    success: async (picked: { link: string; name: string }[]) => {
      const files = await Promise.all(picked.map((f) => fetchFile(f.link, f.name)))
      onFiles(files)
    },
    cancel: () => {},
    linkType: 'direct',
    multiselect: true,
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.bmp', '.svg', '.heic', '.heif'],
  })
}

// ── Google Drive ──────────────────────────────────────────────────────────────
export async function openGoogleDrivePicker(
  fetchFile: FetchFileFn,
  onFiles: (files: File[]) => void,
): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  if (!apiKey || !clientId) throw new Error('env:NEXT_PUBLIC_GOOGLE_API_KEY + NEXT_PUBLIC_GOOGLE_CLIENT_ID')

  await Promise.all([
    loadScript('https://accounts.google.com/gsi/client', 'googleGsi'),
    loadScript('https://apis.google.com/js/api.js', 'googleApi'),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gapi = (window as any).gapi
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const google = (window as any).google

  await new Promise<void>((resolve) => gapi.load('picker', resolve))

  const token = await new Promise<string>((resolve, reject) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      callback: (res: { access_token?: string; error?: string }) => {
        if (res.error) reject(new Error(res.error))
        else resolve(res.access_token!)
      },
    })
    client.requestAccessToken()
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gPicker = (window as any).google.picker

  new gPicker.PickerBuilder()
    .enableFeature(gPicker.Feature.MULTISELECT_ENABLED)
    .setOAuthToken(token)
    .setDeveloperKey(apiKey)
    .addView(gPicker.ViewId.DOCS_IMAGES)
    .setCallback(async (data: { action: string; docs?: { id: string; name: string }[] }) => {
      if (data.action !== gPicker.Action.PICKED || !data.docs) return
      const files = await Promise.all(
        data.docs.map((doc) =>
          fetchFile(
            `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`,
            doc.name,
            { Authorization: `Bearer ${token}` },
          ),
        ),
      )
      onFiles(files)
    })
    .build()
    .setVisible(true)
}

