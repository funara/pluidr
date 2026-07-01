import { checkAndPromptUpdate } from "../../core/versionCheck.js"
import { version } from "../../core/version.js"

export async function runUpdate() {
  const updated = await checkAndPromptUpdate(version)
  if (updated) {
    console.log("Update successful. Please run pluidr again to start the new version.")
  }
}
