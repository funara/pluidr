import { checkAndPromptUpdate } from "../../core/versionCheck.js"
import { version } from "../../core/version.js"

export async function runUpdate() {
  await checkAndPromptUpdate(version)
}
