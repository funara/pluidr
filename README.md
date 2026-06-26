# Pluidr

[![npm version](https://img.shields.io/npm/v/pluidr)](https://www.npmjs.com/package/pluidr)
[![npm downloads](https://img.shields.io/npm/dm/pluidr)](https://www.npmjs.com/package/pluidr)
[![License](https://img.shields.io/npm/l/pluidr)](https://github.com/funara/pluidr/blob/main/LICENSE)

**Explore · Plan · Build · Debug** — opinionated engineering workflow installer for [OpenCode](https://opencode.ai).

## How it works

Pluidr sets up a **12-agent** pipeline in OpenCode organized under **2 primary agents**: **Composer** (orchestrating 7 subagents across 3 phases) and **Debugger** (standalone, 3 subagents). Every agent has a strict role, scoped permissions, and no shared subagents.

### Primary Agents

**1. Composer tab** — The single entry point for all feature work. Composer runs 3 strict, sequential phases:

- **EXPLORE phase** (mandatory start) — Brainstorms with you, scans the codebase and web for context. Can delegate deep fact-finding to Researcher. Produces actionable recommendations with certainty marking. Uses a **guardrail gate**: must ask you "Ready to write the PRD?" before proceeding to Plan.

- **PLAN phase** — Turns findings into a verified PRD via Plan-Writer → Plan-Checker. Plan-Writer writes the PRD to `docs/plans/`. Plan-Checker validates against your original request (PASS/FAIL + gap list only). On FAIL, surfaces gap remedies to you via the question tool (max 3 loops). On PASS, uses a **guardrail gate**: must ask you "Build from this PRD?" before proceeding to Build.

- **BUILD phase** — Executes the confirmed PRD via Coder → Tester → Reviewer → Writer in strict sequence. Coder implements, Tester validates (PASS/FAIL/BLOCKED), Reviewer gates against the PRD definition-of-done, Writer produces a completion report to `docs/reports/`. Coder→Coder loops without verification are forbidden. Max 3 consecutive FAILs before surfacing to you.

Composer never edits files or runs bash directly — all work is delegated to subagents.

**2. Debugger tab** (standalone, user-triggered at any time) — Root-cause analysis using the **Brooks-Lint methodology** (Iron Law + 6 Decay Risks). Delegates investigation to Inspector, fixes to Fixer, and reports to Reporter. Does not depend on Composer — triggered directly by you.

### Exclusive Subagents

Each subagent belongs to exactly one primary agent and cannot be invoked by anyone else:

| Primary | Phase | Subagents | Role |
|---------|-------|-----------|------|
| Composer | EXPLORE | Researcher | Technical/codebase fact-finding (confirmed_facts/inferred_facts/unknowns/risks) |
| Composer | PLAN | Plan-Writer | Stateless PRD formatter — writes to `docs/plans/`, missing input = TBD |
| Composer | PLAN | Plan-Checker | **Gate** — validates PRD against original request, PASS/FAIL + gap list only |
| Composer | BUILD | Coder | Writes and edits implementation code |
| Composer | BUILD | Tester | Runs tests, reports PASS/FAIL/BLOCKED + coverage gaps |
| Composer | BUILD | Reviewer | **Gate** — compares implementation against definition-of-done, PASS/FAIL + gap list only |
| Composer | BUILD | Writer | Stateless document formatter — writes completion reports to `docs/reports/` |
| Debugger | — | Inspector | Brooks-Lint RCA (Iron Law + 6 decay risks + 4 review modes) |
| Debugger | — | Fixer | Applies minimal, root-cause-targeted fixes |
| Debugger | — | Reporter | Stateless diagnosis report formatter (Iron Law structure) |

### Workflow

```
  You describe a feature / idea
         │
         ▼
  Composer — always starts in EXPLORE phase
         │
  ┌───────┤
  │       ▼
  │  [Optional] Researcher → deep fact-finding
  │       ▼
  │  Synthesize findings → Internally assess complexity
  │    ├── Simple → GUARDRAIL GATE 1a (question tool):
  │    │   "Ready to build directly?"
  │    │   ├── "Yes" → BUILD phase
  │    │   ├── "Write a PRD first" → PLAN phase
  │    │   └── "More research" → continue exploring
  │    └── Complex → GUARDRAIL GATE 1b (question tool):
  │        "Ready to write the PRD?"
  │        ├── "Yes" → PLAN phase
  │        └── "More research" → continue exploring
  │       │                              │
  │       ▼ (PLAN)                       ▼ (direct BUILD)
  │  Plan-Writer → docs/plans/      Coder → Tester →
  │  Plan-Checker validates         Reviewer → Writer → docs/reports/
  │       │
  │       ▼ (FAIL, max 3 loops)
  │  Surface gaps → you pick remedy
  │       │
  │       ▼ (PASS)
  │  GUARDRAIL GATE 2 (question tool):
  │    "Build from this PRD?"
  │    └── "Yes" → BUILD phase
  │         Coder → Tester → Reviewer → Writer → docs/reports/
         │
         ▼
  You review the result
         │
  (If bug found at any point → Debugger → Inspector → Fixer →
   Reporter → you verify)
```

### Flow Rules

| Rule | Detail |
|------|--------|
| **Mandatory EXPLORE start** | Composer always starts in EXPLORE phase — no skipping to Plan or Build without passing a guardrail gate |
| **Complexity assessment** | Composer internally evaluates if the feature is simple (few files, low risk, clear approach) — this is LLM judgment, not user choice |
| **Guardrail Gate 1** | Simple → question tool: "Ready to build directly?" Complex → question tool: "Ready to write the PRD?" Both paths require user confirmation |
| **Guardrail Gate 2** | PLAN→BUILD: question tool asks "Build from this PRD?" with explicit confirmation |
| **Direct build path** | Simple features can skip PLAN phase — Composer determines simplicity, user just confirms |
| **Gate agents** | Plan-Checker and Reviewer output PASS/FAIL + gap list only — no improvement suggestions, no decisions |
| **Researcher agents** | Researcher and Inspector output confirmed_facts/inferred_facts/unknowns/risks — no recommendations |
| **Writer agents** | Plan-Writer, Writer, and Reporter are stateless formatters — missing input = TBD, never invent content |
| **Phase-scoped delegation** | EXPLORE: researcher only. PLAN: plan-writer, plan-checker only. BUILD: coder, tester, reviewer, writer only |
| **Build gate order** | Coder → Tester → Reviewer → Writer — no skipping, no Coder→Coder without verification |
| **Planner FAIL loop** | Plan-checker FAIL → Composer surfaces gap remedies to you via question tool (MC options) → you pick → Composer routes to Plan-Writer. Max 3 loops, then surfaces to you for direction |
| **Builder FAIL loop** | 3 consecutive FAILs from Tester or Reviewer → Composer surfaces to you |
| **Output directories** | Plan-Writer writes to `docs/plans/`. Writer writes to `docs/reports/`. Enforced by permissions |
| **Debugger independence** | Debugger is standalone — does not flow through Composer, triggered directly by you |

### Brooks-Lint Methodology (Debugger)

The Debugger group uses the [Brooks-Lint](https://hyhmrright.github.io/brooks-lint/guide.html) framework:

- **Iron Law** per finding: Symptom → Source → Consequence → Remedy
- **6 Decay Risks (R1-R6)**: Cognitive Overload, Change Propagation, Knowledge Duplication, Accidental Complexity, Dependency Disorder, Domain Model Distortion
- **4 Review Modes**: PR Review (R1-R6), Architecture Audit (dependency analysis), Tech Debt Assessment (Pain × Spread), Test Quality (T1-T6)
- **T1-T6 Test Risks**: Test Obscurity, Brittleness, Duplication, Mock Abuse, Coverage Illusion, Architecture Mismatch

### Principle Hierarchy

Conflict resolution follows a strict priority order (defined in `hierarchy.txt`):

1. **PRD / Spec** (explicit requirement text)
2. **Verdict** (Reviewer PASS/FAIL, Plan-Checker PASS/FAIL)
3. **Engineering principles tied to correctness** (Fail Fast, Single Responsibility)
4. **Heuristics** (KISS, DRY, SOLID, Law of Demeter)
5. **Local optimization / style preference**

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
- Copies the bundled `parent-session` plugin into `~/.config/opencode/plugins/`
- Writes a `package.json` into `~/.config/opencode/` declaring `@opencode-ai/plugin` as a dependency (OpenCode installs it automatically on first launch via its bundled Bun runtime)

On completion, prints:
```
Pluidr setup complete!
You can update your agent model settings later in opencode.jsonc
```
The filename `opencode.jsonc` (second line) is a clickable terminal hyperlink — Ctrl+click to open the config in your default editor.

## Bundled plugins

Pluidr ships with one plugin: [`parent-session`](src/plugins/README.md), which gives subagents three tools for cross-session context access:

- `parent_session_messages` — read the parent session's transcript
- `session_messages(sessionId)` — read any session by ID
- `session_messages_batch(sessionIds)` — read multiple sessions in one call

`pluidr init` installs the plugin and its dependency declaration automatically — no extra user action. On OpenCode's first launch, the bundled Bun runtime installs `@opencode-ai/plugin` from the generated `package.json`, then the plugin's tools become available to all subagents.
