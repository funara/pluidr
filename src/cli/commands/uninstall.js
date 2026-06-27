import { existsSync, copyFileSync, rmSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { getConfigDir, getConfigPath } from "../../core/paths.js"

function findLatestBackup() {
  const dir = getConfigDir()
  let backups = []
  try {
    backups = readdirSync(dir)
      .filter((f) => f.startsWith("opencode.jsonc.bak."))
      .sort()
      .reverse()
  } catch {
    return null
  }
  return backups.length > 0 ? join(dir, backups[0]) : null
}

export async function runUninstall() {
  const configDir = getConfigDir()
  const configPath = getConfigPath()
  const promptsDir = join(configDir, "prompts")
  const pluginsDir = join(configDir, "plugins")
  const binDir = join(configDir, "bin")

  const summary = { restored: null, removed: [] }

  // Restore latest backup
  const latestBackup = findLatestBackup()
  if (latestBackup && existsSync(configPath)) {
    copyFileSync(latestBackup, configPath)
    summary.restored = latestBackup
  } else if (latestBackup) {
    // Config doesn't exist but backup does — restore anyway
    copyFileSync(latestBackup, configPath)
    summary.restored = latestBackup
  }

  // Remove Pluidr-installed artifacts
  if (existsSync(promptsDir)) {
    rmSync(promptsDir, { recursive: true, force: true })
    summary.removed.push("prompts/")
  }
  if (existsSync(pluginsDir)) {
    rmSync(pluginsDir, { recursive: true, force: true })
    summary.removed.push("plugins/")
  }
  if (existsSync(binDir)) {
    rmSync(binDir, { recursive: true, force: true })
    summary.removed.push("bin/")
  }

  // Print summary
  console.log("Uninstall complete:")
  if (summary.restored) {
    console.log(`  ✓ Restored ${summary.restored}`)
  } else {
    console.log("  - No backup found to restore")
  }
  if (summary.removed.length > 0) {
    console.log(`  ✓ Removed: ${summary.removed.join(", ")}`)
  } else {
    console.log("  - No Pluidr artifacts found to remove")
  }
  console.log("  - Kept opencode.jsonc (preserves user customizations)")
  console.log("  - Kept package.json (may be used by other plugins)")
}
