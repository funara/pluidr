import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { getConfigDir } from "./paths.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PLUGIN_NAME = "parent-session.js"
const PACKAGE_JSON = {
  dependencies: { "@opencode-ai/plugin": "^1.17.9" },
}

export function writePluginBundle() {
  const pluginsDir = join(getConfigDir(), "plugins")
  mkdirSync(pluginsDir, { recursive: true })

  const sourcePath = resolve(__dirname, "../plugins", PLUGIN_NAME)
  copyFileSync(sourcePath, join(pluginsDir, PLUGIN_NAME))
}

export function writePluginPackageJson() {
  const packageJsonPath = join(getConfigDir(), "package.json")
  if (existsSync(packageJsonPath)) return

  writeFileSync(packageJsonPath, JSON.stringify(PACKAGE_JSON, null, 2), "utf-8")
}
