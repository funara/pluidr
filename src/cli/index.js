import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { runInit } from "./commands/init.js"
import { runUninstall } from "./commands/uninstall.js"
import { runUpdate } from "./commands/update.js"
import { runDoctor } from "./commands/doctor.js"
import { runLaunch } from "./commands/launch.js"
import { version } from "../core/version.js"

const HELP = `Usage: pluidr [command]

  pluidr              Check for updates, run doctor, launch opencode
  pluidr init         Set up OpenCode with Pluidr's 17-agent pipeline
  pluidr update       Check for pluidr updates
  pluidr doctor       Verify installation health
  pluidr uninstall    Remove Pluidr artifacts and restore previous config
  --version, -v       Print version number
  --help, -h          Show this help message`

export function run(argv) {
  const cmd = argv[2]

  if (!cmd) {
    return runLaunch()
  }

  if (cmd === "--help" || cmd === "-h") {
    console.log(HELP)
    return
  }

  if (cmd === "--version" || cmd === "-v") {
    console.log(version)
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

  console.error(`Unknown command: ${cmd}\n`)
  console.log(HELP)
  process.exit(1)
}
