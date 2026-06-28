import { describe, it } from "node:test"
import assert from "node:assert"
import { homedir } from "node:os"
import { join } from "node:path"
import { getConfigDir, getConfigPath, getPromptsDir } from "./paths.js"

const BASE = join(homedir(), ".config", "opencode")

describe("paths", () => {
  it("getConfigDir returns ~/.config/opencode", () => {
    assert.strictEqual(getConfigDir(), BASE)
  })

  it("getConfigPath returns opencode.jsonc path", () => {
    assert.strictEqual(getConfigPath(), join(BASE, "opencode.jsonc"))
  })

  it("getPromptsDir returns prompts path", () => {
    assert.strictEqual(getPromptsDir(), join(BASE, "prompts"))
  })
})
