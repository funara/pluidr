import { runInit } from "./commands/init.js"

export function run(argv) {
  const cmd = argv[2]

  if (cmd === "init") {
    return runInit()
  }

  console.log("Usage: pluidr init")
  process.exit(1)
}
