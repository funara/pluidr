import { select, text, isCancel } from "@clack/prompts"

const TIER_LABELS = {
  reasoningHeavy: "Model for reasoning task",
  fast: "Model for fast/cheap task",
}

export async function selectModelTier(modelDefaults) {
  const choices = {}

  for (const [tierKey, tierInfo] of Object.entries(modelDefaults)) {
    const defaultModel = `${tierInfo.provider}/${tierInfo.model}`
    const label = TIER_LABELS[tierKey] ?? tierKey

    let selectedModel = defaultModel

    try {
      const answer = await select({
        message: label,
        options: [
          { value: defaultModel, label: `default (${defaultModel})` },
          { value: "__custom__", label: "custom  (provider/model)" },
        ],
      })

      if (isCancel(answer)) {
        selectedModel = defaultModel
      } else if (answer === "__custom__") {
        try {
          const customModel = await text({
            message: "Enter model:",
          })
          selectedModel = isCancel(customModel) ? defaultModel : (customModel || defaultModel)
        } catch {
          selectedModel = defaultModel
        }
      } else {
        selectedModel = answer
      }
    } catch {
      selectedModel = defaultModel
    }

    choices[tierKey] = selectedModel
  }

  return choices
}
