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

    const answer = await select({
      message: label,
      options: [
        { value: defaultModel, label: `default (${defaultModel})` },
        { value: "__custom__", label: "custom  (provider/model)" },
      ],
    }).catch(() => defaultModel)

    if (isCancel(answer)) {
      choices[tierKey] = defaultModel
    } else if (answer === "__custom__") {
      const customModel = await text({ message: "Enter model:" })
        .catch(() => defaultModel)
      choices[tierKey] = isCancel(customModel) ? defaultModel : (customModel || defaultModel)
    } else {
      choices[tierKey] = answer
    }
  }
  return choices
}
