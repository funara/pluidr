import { mkdirSync, writeFileSync } from "node:fs"
import { getConfigDir, getConfigPath } from "./paths.js"

export function writeConfig(configObject) {
  mkdirSync(getConfigDir(), { recursive: true })
  writeFileSync(getConfigPath(), JSON.stringify(configObject, null, 2), "utf-8")
}
