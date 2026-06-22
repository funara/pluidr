import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { runInit } from "./commands/init.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(resolve(__dirname, "../../package.json"), "utf-8"))

export function run(argv) {
  const cmd = argv[2]

  if (cmd === "--version" || cmd === "-v") {
    console.log(pkg.version)
    return
  }

  if (cmd === "init") {
    return runInit()
  }

  console.log("Usage: pluidr init")
  process.exit(1)
}
