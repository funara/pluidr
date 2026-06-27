import { existsSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

const BIN_NAME = process.platform === "win32" ? "rtk.exe" : "rtk"
const SQUEEZE_BIN = join(homedir(), ".config", "opencode", "bin", BIN_NAME)

function normalise(p) {
  return p.replace(/\\/g, "/")
}

async function findBinary($) {
  try {
    await $`which rtk`.quiet()
    return "rtk"
  } catch {
    if (existsSync(SQUEEZE_BIN)) {
      return normalise(SQUEEZE_BIN)
    }
    return null
  }
}

export const PluidrSqueezePlugin = async ({ $ }) => {
  const binPath = await findBinary($)
  if (!binPath) {
    console.warn("[squeeze] rtk binary not found — plugin disabled")
    return {}
  }

  return {
    "tool.execute.before": async (input, output) => {
      const tool = String(input?.tool ?? "").toLowerCase()
      if (tool !== "bash" && tool !== "shell") return
      const args = output?.args
      if (!args || typeof args !== "object") return

      const command = args.command
      if (typeof command !== "string" || !command) return

      try {
        const result = await $`${binPath} rewrite ${command}`.quiet().nothrow()
        const rewritten = String(result.stdout).trim()
        if (rewritten && rewritten !== command) {
          args.command = rewritten
        }
      } catch {
        // rewrite failed — pass through unchanged
      }
    },
  }
}
