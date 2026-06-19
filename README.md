# Pluidr

**Plan · Build · Review** — opinionated engineering workflow installer for [OpenCode](https://opencode.ai).

## How it works

Pluidr sets up a three-agent pipeline in OpenCode. Each agent has a dedicated tab and a strict role:

**1. Planner tab** — Turns your request into a verified PRD. It researches technical facts, writes the spec, and validates it for completeness before asking you to confirm.

**2. Builder tab** — Executes the confirmed PRD. It delegates coding to Coder, runs tests via Tester, then checks traceability with Verifier before reporting completion. Builder never edits files directly.

**3. Reviewer tab** — Reviews completed work. It traces every requirement to code via Verifier, runs Debugger for root-cause analysis if needed, and produces a summary report.

**Shared subagents** (automated, not user-facing):

| Subagent             | Job                                                |
| -------------------- | -------------------------------------------------- |
| **Coder**      | Writes and edits code                              |
| **Tester**     | Runs tests, reports PASS/FAIL/coverage gaps        |
| **Verifier**   | Boolean gate — compares artifacts, PASS/FAIL only |
| **Debugger**   | Root-cause analysis                                |
| **Researcher** | Technical/codebase fact-finding                    |
| **Writer**     | Stateless formatter — PRDs and reports            |

**Typical session:**

```
You describe a feature → Planner researches + writes PRD → you confirm →
Builder codes + tests + verifies → Reviewer checks everything
```

If you need a small change during planning, Planner will redirect you to Builder — it can't edit files. If a bug is found during review, Reviewer traces it and Debugger diagnoses, but fixes go back through Builder.

## Install

```sh
npm install -g pluidr
```

Or run directly without installing:

```sh
npx pluidr init
```

## Usage

### `pluidr init`

Prompts you to select models for two agent tiers, then:

- Builds a complete `opencode.jsonc` config with the chosen models injected into the right agents
- Backs up any existing config at `~/.config/opencode/opencode.jsonc` to `opencode.jsonc.bak`
- Writes the new config to `~/.config/opencode/opencode.jsonc`
- Copies agent system-prompt files into `~/.config/opencode/prompts/`
