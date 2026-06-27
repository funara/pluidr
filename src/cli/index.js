import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { runInit } from "./commands/init.js"
import { runUninstall } from "./commands/uninstall.js"
import { runUpdate } from "./commands/update.js"
import { runDoctor } from "./commands/doctor.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(resolve(__dirname, "../../package.json"), "utf-8"))

const HELP = `Usage: pluidr <command>

Commands:
  init          Set up OpenCode with Pluidr's 12-agent pipeline
  uninstall     Remove Pluidr artifacts and restore previous config
  update        Re-run setup (overwrites current config)
  doctor        Verify installation health
  --version, -v  Print version number
  --help, -h     Show this help message`

export function run(argv) {
  const cmd = argv[2]

  if (cmd === "--help" || cmd === "-h") {
    console.log(HELP)
    return
  }

  if (cmd === "--version" || cmd === "-v") {
    console.log(pkg.version)
    return
  }

  if (cmd === "init") {
    return runInit()
  }

  if (cmd === "uninstall") {
    return runUninstall()
  }

  if (cmd === "update") {
    return runUpdate()
  }

  if (cmd === "doctor") {
    return runDoctor()
  }

  console.log(HELP)
  process.exit(1)
}
