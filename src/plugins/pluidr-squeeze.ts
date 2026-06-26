import { homedir } from "node:os"
import { join } from "node:path"
import type { Plugin } from "@opencode-ai/plugin"

const BIN_NAME = process.platform === "win32" ? "rtk.exe" : "rtk"
const SQUEEZE_BIN = join(homedir(), ".config", "opencode", "bin", BIN_NAME)

async function findBinary($: any): Promise<string | null> {
  try {
    await $`which rtk`.quiet()
    return "rtk"
  } catch {
    try {
      await $`test -f ${SQUEEZE_BIN}`.quiet()
      return SQUEEZE_BIN
    } catch {
      return null
    }
  }
}

export const PluidrSqueezePlugin: Plugin = async ({ $ }) => {
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

      const command = (args as Record<string, unknown>).command
      if (typeof command !== "string" || !command) return

      try {
        const result = await $`${binPath} rewrite ${command}`.quiet().nothrow()
        const rewritten = String(result.stdout).trim()
        if (rewritten && rewritten !== command) {
          ;(args as Record<string, unknown>).command = rewritten
        }
      } catch {
        // rewrite failed — pass through unchanged
      }
    },
  }
}
