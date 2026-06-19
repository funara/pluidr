import { readFileSync } from "node:fs"
import { resolve } from "node:path"

export function buildConfig(tierChoices, templatesDir) {
  const configPath = resolve(templatesDir, "opencode.config.json")
  const defaultsPath = resolve(templatesDir, "model-defaults.json")

  const config = JSON.parse(readFileSync(configPath, "utf-8"))
  const modelDefaults = JSON.parse(readFileSync(defaultsPath, "utf-8"))

  for (const [tierKey, tier] of Object.entries(modelDefaults)) {
    const model = tierChoices[tierKey]
    for (const agentName of tier.agents) {
      config.agent[agentName].model = model
    }
  }

  return config
}
