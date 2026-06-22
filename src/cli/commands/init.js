import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { selectModelTier } from "../wizard/selectModelTier.js"
import { backupExistingConfig } from "../../core/backup.js"
import { buildConfig } from "../../core/configBuilder.js"
import { writeConfig } from "../../core/configWriter.js"
import { writeAgentPrompts } from "../../core/agentPromptWriter.js"
import { writePluginBundle, writePluginPackageJson } from "../../core/pluginWriter.js"
import { getConfigPath } from "../../core/paths.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = resolve(__dirname, "../../templates")

function makeFileHyperlink(absolutePath, displayText) {
  const normalized = absolutePath.replace(/\\/g, "/").replace(/^\//, "")
  const fileUrl = `file:///${normalized}`
  return `\x1b]8;;${fileUrl}\x1b\\${displayText}\x1b]8;;\x1b\\`
}

export async function runInit() {
  const defaultsPath = resolve(TEMPLATES_DIR, "model-defaults.json")
  const modelDefaults = JSON.parse(readFileSync(defaultsPath, "utf-8"))

  const tierChoices = await selectModelTier(modelDefaults)

  backupExistingConfig()

  const configObject = buildConfig(tierChoices, TEMPLATES_DIR)
  writeConfig(configObject)
  writeAgentPrompts(TEMPLATES_DIR)
  writePluginBundle()
  writePluginPackageJson()

  console.log(`Pluidr setup complete!\nYou can update your agent model settings later in ${makeFileHyperlink(getConfigPath(), "opencode.jsonc")}`)
}
