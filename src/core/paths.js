import { homedir } from "node:os"
import { join } from "node:path"

const BASE = join(homedir(), ".config", "opencode")

export function getConfigDir() {
  return BASE
}

export function getConfigPath() {
  return join(BASE, "opencode.jsonc")
}

export function getBackupPath() {
  return join(BASE, "opencode.jsonc.bak")
}

export function getPromptsDir() {
  return join(BASE, "prompts")
}
