import { existsSync, copyFileSync } from "node:fs"
import { getConfigPath, getBackupPath } from "./paths.js"

export function backupExistingConfig() {
  if (existsSync(getConfigPath())) {
    copyFileSync(getConfigPath(), getBackupPath())
  }
}
