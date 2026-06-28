import { homedir } from "node:os"
import { join } from "node:path"

const BASE = join(homedir(), ".config", "opencode")

export const getConfigDir = () => BASE
export const getConfigPath = () => join(BASE, "opencode.jsonc")
export const getPromptsDir = () => join(BASE, "prompts")
// ponytail: getBackupPath removed (YAGNI)
