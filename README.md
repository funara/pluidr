# Pluidr

[![npm version](https://img.shields.io/npm/v/pluidr)](https://www.npmjs.com/package/pluidr)
[![npm downloads](https://img.shields.io/npm/dm/pluidr)](https://www.npmjs.com/package/pluidr)
[![License](https://img.shields.io/npm/l/pluidr)](https://github.com/funara/pluidr/blob/main/LICENSE)

**Plan · Build · Review · Debug** — opinionated engineering workflow installer for [OpenCode](https://opencode.ai).

## How it works

Pluidr sets up a **14-agent** pipeline in OpenCode organized under **4 primary agents**, each with a dedicated tab and exclusive subagents. Every agent has a strict role, scoped permissions, and no shared subagents.

### Primary Agents

**1. Explorer tab** (optional, research-only) — Brainstorms with you, scans the codebase and web for context, then produces actionable recommendations. No subagents, no file editing. Handoff to Planner when you're ready to formalize.

**2. Planner tab** — Turns your request into a verified PRD. It researches technical facts via Researcher, writes the spec via Plan-Writer, and validates it for completeness via Plan-Checker before asking you to confirm. Planner never edits files directly.

**3. Builder tab** — Executes a confirmed PRD. It delegates implementation to Coder, tests via Tester, checks traceability with Reviewer, and produces a completion report via Writer. Builder never edits files or runs bash directly.

**4. Debugger tab** (standalone, user-triggered at any time) — Root-cause analysis using the **Brooks-Lint methodology** (Iron Law + 6 Decay Risks). Delegates investigation to Inspector, fixes to Fixer, and reports to Reporter. Does not depend on Builder — triggered directly by you.

### Exclusive Subagents

Each subagent belongs to exactly one primary agent and cannot be invoked by anyone else:

| Primary | Subagents | Role |
|---------|-----------|------|
| Explorer | *(none)* | Research + recommendations only |
| Planner | Researcher | Technical/codebase fact-finding (confirmed_facts/inferred_facts/unknowns/risks) |
| Planner | Plan-Writer | Stateless PRD formatter — missing input = TBD |
| Planner | Plan-Checker | **Gate** — validates PRD against original request, PASS/FAIL + gap list only |
| Builder | Coder | Writes and edits implementation code |
| Builder | Tester | Runs tests, reports PASS/FAIL/BLOCKED + coverage gaps |
| Builder | Reviewer | **Gate** — compares implementation against definition-of-done, PASS/FAIL + gap list only |
| Builder | Writer | Stateless document formatter — completion reports |
| Debugger | Inspector | Brooks-Lint RCA (Iron Law + 6 decay risks + 4 review modes) |
| Debugger | Fixer | Applies minimal, root-cause-targeted fixes |
| Debugger | Reporter | Stateless diagnosis report formatter (Iron Law structure) |

### Workflow

```
  You describe a feature / idea
         │
         ▼
  (Optional) Explorer → research + recommendations → User decides
         │
         ▼
  Planner → (if needed) Researcher → Plan-Writer writes PRD →
    Plan-Checker validates → you confirm → handoff to Builder
         │
         ▼
  Builder → Coder implements → Tester runs tests →
    Reviewer checks DoD → Writer produces completion report
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
| **Gate agents** | Plan-Checker and Reviewer output PASS/FAIL + gap list only — no improvement suggestions, no decisions |
| **Researcher agents** | Researcher and Inspector output confirmed_facts/inferred_facts/unknowns/risks — no recommendations |
| **Writer agents** | Plan-Writer, Writer, and Reporter are stateless formatters — missing input = TBD, never invent content |
| **Build gate order** | Coder → Tester → Reviewer → Writer (Builder orchestrates in sequence) |
| **Loop limit** | 3 consecutive FAILs from Tester or Reviewer → Builder surfaces to you |
| **No shared subagents** | Each subagent belongs to exactly one primary — no cross-primary delegation |
| **Debugger independence** | Debugger is standalone — does not flow through Builder, triggered directly by you |

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
