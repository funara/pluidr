import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { selectModelTier } from "../wizard/selectModelTier.js"
import { backupExistingConfig } from "../../core/backup.js"
import { buildConfig } from "../../core/configBuilder.js"
import { writeConfig } from "../../core/configWriter.js"
import { writeAgentPrompts } from "../../core/agentPromptWriter.js"
import { getConfigPath, getPromptsDir } from "../../core/paths.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = resolve(__dirname, "../../templates")

export async function runInit() {
  const defaultsPath = resolve(TEMPLATES_DIR, "model-defaults.json")
  const modelDefaults = JSON.parse(readFileSync(defaultsPath, "utf-8"))

  const tierChoices = await selectModelTier(modelDefaults)

  backupExistingConfig()

  const configObject = buildConfig(tierChoices, TEMPLATES_DIR)
  writeConfig(configObject)
  writeAgentPrompts(TEMPLATES_DIR)

  console.log("\nPluidr init complete!")
  console.log(`  Config  : ${getConfigPath()}`)
  console.log(`  Prompts : ${getPromptsDir()}`)
}
