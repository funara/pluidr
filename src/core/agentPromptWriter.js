import { mkdirSync, readdirSync, copyFileSync } from "node:fs"
import { resolve } from "node:path"
import { getPromptsDir } from "./paths.js"

export function writeAgentPrompts(templatesDir) {
  const sourceDir = resolve(templatesDir, "agent-prompts")
  const destDir = getPromptsDir()

  mkdirSync(destDir, { recursive: true })

  for (const file of readdirSync(sourceDir)) {
    copyFileSync(resolve(sourceDir, file), resolve(destDir, file))
  }
}
