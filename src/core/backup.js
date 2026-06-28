import { existsSync, copyFileSync, readdirSync, unlinkSync } from "node:fs"
import { join, dirname } from "node:path"
import { getConfigPath } from "./paths.js"

const MAX_BACKUPS = 5

function timestamp() {
  // ponytail: simplified formatting using native Date serialization
  const s = new Date().toISOString().replace(/[-:]/g, "")
  return `${s.slice(0, 8)}_${s.slice(9, 15)}`
}

function rotateBackups(configPath) {
  const dir = dirname(configPath)
  const baseName = "opencode.jsonc.bak"
  let backups = []

  try {
    backups = readdirSync(dir)
      .filter((f) => f.startsWith(baseName + "."))
      .map((f) => join(dir, f))
      .sort()
  } catch { /* dir doesn't exist yet */ }

  while (backups.length >= MAX_BACKUPS) {
    const oldest = backups.shift()
    try { unlinkSync(oldest) } catch {}
  }
}

export function backupExistingConfig(configPath) {
  const resolvedPath = configPath || getConfigPath()
  if (!existsSync(resolvedPath)) return

  rotateBackups(resolvedPath)
  const backupPath = `${resolvedPath}.bak.${timestamp()}`
  copyFileSync(resolvedPath, backupPath)
}
