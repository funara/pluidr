import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"
import { getConfigDir, getConfigPath, getPromptsDir } from "../../core/paths.js"
import { findRtkPath } from "../../core/squeezeInstaller.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const EXPECTED_PROMPT_COUNT = 13
const PLUGIN_FILES = ["pluidr-flow.js", "pluidr-squeeze.js"]

export async function runDoctor() {
  const configDir = getConfigDir()
  const configPath = getConfigPath()
  const promptsDir = getPromptsDir()
  const pluginsDir = join(configDir, "plugins")
  const packageJsonPath = join(configDir, "package.json")
  const binDir = join(configDir, "bin")

  const checks = []

  // 1. opencode.jsonc exists
  const configExists = existsSync(configPath)
  checks.push({ component: "opencode.jsonc", pass: configExists })

  // 2. All 13 prompt files exist
  let promptCount = 0
  if (existsSync(promptsDir)) {
    try {
      const files = readdirSync(promptsDir).filter((f) => f.endsWith(".txt"))
      promptCount = files.length
    } catch {
      promptCount = 0
    }
  }
  checks.push({ component: "13 prompt files", pass: promptCount === EXPECTED_PROMPT_COUNT, detail: `${promptCount}/${EXPECTED_PROMPT_COUNT}` })

  // 3. Both plugin files exist
  let pluginsFound = 0
  for (const f of PLUGIN_FILES) {
    if (existsSync(join(pluginsDir, f))) pluginsFound++
  }
  checks.push({ component: "plugin files", pass: pluginsFound === PLUGIN_FILES.length, detail: `${pluginsFound}/${PLUGIN_FILES.length}` })

  // 4. package.json with @opencode-ai/plugin dependency
  let pkgValid = false
  if (existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"))
      pkgValid = !!(pkg.dependencies && pkg.dependencies["@opencode-ai/plugin"])
    } catch {
      pkgValid = false
    }
  }
  checks.push({ component: "package.json + plugin dep", pass: pkgValid })

  // 5. RTK binary exists
  let rtkFound = false
  const rtkOnPath = findRtkPath()
  if (rtkOnPath) {
    rtkFound = true
  } else {
    const binName = process.platform === "win32" ? "rtk.exe" : "rtk"
    rtkFound = existsSync(join(binDir, binName))
  }
  checks.push({ component: "squeeze binary", pass: rtkFound })

  // 6. Config is valid JSON
  let configValid = false
  if (configExists) {
    try {
      JSON.parse(readFileSync(configPath, "utf-8"))
      configValid = true
    } catch {
      configValid = false
    }
  }
  checks.push({ component: "config JSON validity", pass: configValid })

  // Print summary table
  const allPass = checks.every((c) => c.pass)
  console.log("\nPluidr Doctor — Installation Health Check\n")
  for (const c of checks) {
    const icon = c.pass ? "\u2713" : "\u2717"
    const detail = c.detail ? ` (${c.detail})` : ""
    console.log(`  ${icon} ${c.component}${detail}`)
  }
  console.log("")

  if (allPass) {
    console.log("All checks passed.")
  } else {
    console.log("Some checks failed. Re-run `pluidr init` to repair.")
  }

  process.exit(allPass ? 0 : 1)
}
