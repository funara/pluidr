import { createInterface } from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"

const TIER_LABELS = {
  reasoningHeavy: "Model for reasoning task",
  fast: "Model for fast/cheap task",
}

export async function selectModelTier(modelDefaults) {
  const rl = createInterface({ input, output })
  const choices = {}

  try {
    for (const [tierKey, tierInfo] of Object.entries(modelDefaults)) {
      const defaultModel = `${tierInfo.provider}/${tierInfo.model}`
      const label = TIER_LABELS[tierKey] ?? tierKey

      console.log(`\n${label}`)
      console.log(`  1) Use default (${defaultModel})`)
      console.log(`  2) Enter custom`)

      const answer = await rl.question("> ")

      if (answer.trim() === "2") {
        const custom = await rl.question("  Model (format provider/model): ")
        choices[tierKey] = custom.trim()
      } else {
        choices[tierKey] = defaultModel
      }
    }
  } finally {
    rl.close()
  }

  return choices
}