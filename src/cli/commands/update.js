import { existsSync } from "node:fs"
import { confirm, isCancel } from "@clack/prompts"
import { getConfigPath } from "../../core/paths.js"
import { runInit } from "./init.js"

export async function runUpdate() {
  const configPath = getConfigPath()

  if (existsSync(configPath)) {
    const answer = await confirm({
      message: "Existing Pluidr config found. Overwrite? (Y/n)",
      initialValue: true,
    })

    if (isCancel(answer) || !answer) {
      console.log("Update cancelled.")
      return
    }
  }

  await runInit()
}
