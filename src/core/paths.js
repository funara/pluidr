import { homedir } from "node:os"
import { join } from "node:path"

const BASE = join(homedir(), ".config", "opencode")

export const getConfigDir = () => BASE
export const getConfigPath = () => join(BASE, "opencode.jsonc")
export const getBackupPath = () => join(BASE, "opencode.jsonc.bak")
export const getPromptsDir = () => join(BASE, "prompts")
