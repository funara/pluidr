import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { getConfigDir } from "./paths.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PLUGINS = ["pluidr-flow.js", "pluidr-squeeze.ts"]
const PACKAGE_JSON = {
  dependencies: { "@opencode-ai/plugin": "^1.17.9" },
}

export function writePluginBundle() {
  const pluginsDir = join(getConfigDir(), "plugins")
  mkdirSync(pluginsDir, { recursive: true })

  for (const name of PLUGINS) {
    const sourcePath = resolve(__dirname, "../plugins", name)
    copyFileSync(sourcePath, join(pluginsDir, name))
  }
}

export function writePluginPackageJson() {
  const packageJsonPath = join(getConfigDir(), "package.json")
  if (existsSync(packageJsonPath)) return

  writeFileSync(packageJsonPath, JSON.stringify(PACKAGE_JSON, null, 2), "utf-8")
}
