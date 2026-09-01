// Curated .gitignore snippets keyed by a display label.
export const GITIGNORE_TEMPLATES: Record<string, string> = {
  Node: `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.pnp
.pnp.js

# Coverage
coverage/
*.lcov`,
  'Next.js': `# Next.js
.next/
out/
build/
next-env.d.ts
.vercel`,
  Python: `# Python
__pycache__/
*.py[cod]
*.egg-info/
.eggs/
dist/
build/
.venv/
venv/
env/
.pytest_cache/
.mypy_cache/`,
  Go: `# Go
*.exe
*.test
*.out
/vendor/
/bin/`,
  Rust: `# Rust
/target/
Cargo.lock
**/*.rs.bk`,
  Java: `# Java
*.class
*.jar
*.war
target/
.gradle/
build/`,
  Env: `# Environment
.env
.env.local
.env.*.local
*.env`,
  Logs: `# Logs
logs/
*.log`,
  macOS: `# macOS
.DS_Store
.AppleDouble
.LSOverride
Icon
._*`,
  Windows: `# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.lnk`,
  Linux: `# Linux
*~
.directory
.Trash-*`,
  'VS Code': `# VS Code
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json`,
  JetBrains: `# JetBrains
.idea/
*.iml
*.iws
out/`,
}

export const GITIGNORE_LABELS = Object.keys(GITIGNORE_TEMPLATES)
