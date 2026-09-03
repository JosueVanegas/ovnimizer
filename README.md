<div align="center">

<img src="public/logo.png" alt="Ovnimizer Logo" width="80" />

# Ovnimizer

**Browser-based image optimizer — compress, convert & resize with zero uploads.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-64ff17?style=flat-square)](LICENSE)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://ovnimizer.vercel.app)

[**Live Demo →**](https://ovnimizer.vercel.app)

</div>

---

## What is Ovnimizer?

Ovnimizer is a fast, privacy-first image optimization tool that runs **entirely in your browser**. Your images never leave your device — all compression, conversion, and resizing happens locally via Web Workers using the `OffscreenCanvas` API.

```
Upload → Configure → Optimize → Download
         (all in-browser, no server involved)
```

---

## Features

| | |
|---|---|
| **10+ formats** | JPG · PNG · WebP · AVIF · GIF · BMP · SVG · ICO · HEIC · HEIF |
| **Cloud sources** | Google Drive · Dropbox — pick files without downloading first |
| **Batch processing** | Up to 50 images, 100 MB total per session |
| **Quality presets** | Max · High · Balanced · Aggressive · Minimum |
| **Resize presets** | Original · 2560px · 1920px · 1280px · 800px |
| **Before/After** | Side-by-side comparison slider for every image |
| **ZIP download** | One-click batch download as a single `.zip` |
| **7 languages** | Spanish · English · Português · Italiano · 日本語 · Русский · Deutsch |
| **Dark mode** | Full light/dark theme support |
| **Non-blocking UI** | Image processing runs in a dedicated Web Worker thread |

---

## Tech Stack

```
Framework       Next.js 15 (App Router, React 19)
Language        TypeScript 5
Styling         Tailwind CSS 4
i18n            next-intl 4  (7 locales)
Image decoding  heic2any  ·  OffscreenCanvas (Web Worker)
File handling   react-dropzone  ·  jszip
Cloud SDKs      Google Picker API  ·  Dropbox Chooser
UI              shadcn/ui  ·  Lucide React  ·  Sonner
```

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/JosueVanegas/ovnimizer.git
cd ovnimizer
npm install
```

### 2. Environment variables (optional)

Cloud integrations are optional. The app works fully without them.

```bash
cp .env.local.example .env.local
```

```env
# .env.local

# Google Drive Picker
NEXT_PUBLIC_GOOGLE_API_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=

# Dropbox Chooser
NEXT_PUBLIC_DROPBOX_APP_KEY=
```

> **Note:** these are `NEXT_PUBLIC_` browser-safe keys only.
> Never put secrets (Client Secrets, private tokens) here.

### 3. Run

```bash
npm run dev      # http://localhost:3000
```

---

## Project Structure

```
ovnimizer/
├── app/
│   └── [locale]/            # Localized routes (SSG)
│       ├── page.tsx         # Main optimizer page
│       └── privacy/         # Privacy policy
├── components/              # UI components
│   ├── ImageUploader.tsx    # Drag-drop + cloud pickers
│   ├── EditorView.tsx       # Main editing interface
│   ├── BeforeAfterSlider.tsx
│   ├── ActionButtons.tsx    # Stats + download
│   └── FloatingCow.tsx      # 🐄 (you'll find out)
├── hooks/
│   ├── useImageProcessor.ts # Worker orchestration + HEIC decode
│   └── useFileUpload.ts     # File state management
├── workers/
│   └── image-processor.worker.ts  # OffscreenCanvas processing
├── lib/
│   ├── cloud-pickers.ts     # Google Drive & Dropbox SDKs
│   ├── constants.ts         # Format / quality / size presets
│   └── zip-handler.ts       # ZIP download logic
└── messages/                # i18n translation files
    ├── en.json
    ├── es.json  ← default
    └── ...
```

---

## How It Works

```
┌─────────────────────────────────────────────────────┐
│                    Main Thread                      │
│                                                     │
│  User drops files / picks from Drive / Dropbox      │
│       ↓                                             │
│  HEIC/HEIF? → decode with heic2any (needs DOM)      │
│       ↓                                             │
│  Dispatch to Web Worker ─────────────────────────┐  │
│       ↑                                          │  │
│  Progress updates ←── OffscreenCanvas compress   │  │
│       ↓                                          │  │
│  Update UI with result blobs                     │  │
│       ↓                                          │  │
│  Download as individual files or ZIP             │  │
└─────────────────────────────────────────────────────┘
```

All heavy lifting (canvas rendering, format encoding, resizing) runs off the main thread so the UI stays responsive during batch operations.

---

## Available Scripts

```bash
npm run dev      # Development server (with hot reload)
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint
```

---

## Cloud Integrations

### Google Drive
Uses the [Google Picker API](https://developers.google.com/drive/picker) with OAuth 2.0.
Requires an **API Key** and **OAuth Client ID** from Google Cloud Console.

### Dropbox
Uses the [Dropbox Chooser JS SDK](https://www.dropbox.com/developers/chooser).
Requires only an **App Key** from the Dropbox App Console.

Both are optional — users can always upload from their local file system.

---

## Supported Formats

| Input | Output |
|---|---|
| JPG / JPEG · PNG · WebP · AVIF | JPG · PNG · WebP · AVIF |
| GIF · BMP · SVG | same + ICO |
| **HEIC / HEIF** (iPhone photos) | JPG (auto-converted) |

---

## Deployment

Optimized for [Vercel](https://vercel.com). Push to `main` and it deploys automatically.

```bash
# Set env vars in Vercel dashboard (optional, for cloud integrations)
NEXT_PUBLIC_GOOGLE_API_KEY
NEXT_PUBLIC_GOOGLE_CLIENT_ID
NEXT_PUBLIC_DROPBOX_APP_KEY
```

> Make sure the **Framework Preset** is set to **Next.js** in your Vercel project settings.

---

## Privacy

All image processing happens **client-side**. No files are ever uploaded to any server.

When using cloud integrations (Google Drive / Dropbox), files are fetched directly in your browser via their official SDKs using your own OAuth credentials. Ovnimizer never stores, transmits, or logs any image data.

See the full [Privacy Policy](https://ovnimizer.vercel.app/en/privacy).

---

## License

[MIT](LICENSE) — free to use, modify, and deploy.

---

<div align="center">

Made by [JosueVanegas](https://github.com/JosueVanegas)

</div>
