# Pluidr

[![npm version](https://img.shields.io/npm/v/pluidr)](https://www.npmjs.com/package/pluidr)
[![npm downloads](https://img.shields.io/npm/dm/pluidr)](https://www.npmjs.com/package/pluidr)
[![License](https://img.shields.io/npm/l/pluidr)](https://github.com/funara/pluidr/blob/main/LICENSE)

** Plan · Build · Review ** — opinionated engineering workflow installer for [OpenCode](https://opencode.ai).

---

## What is Pluidr?

Pluidr installs **3 primary agents + 14 subagents** into OpenCode — each primary agent owns its exclusive subagents, scoped permissions, and enforced workflow rules. No shared subagents. No ad-hoc delegation.

| Primary Agent | Model Tier | Purpose | Subagents |
|---|---|---|---|
| **Composer** | 🧠 Reasoning | Feature work — Explore → Plan → Build | Researcher, Plan-Writer, Plan-Checker, Coder, Tester, Reviewer, Compose-Reporter |
| **Debugger** | 🧠 Reasoning | Bug investigation — Investigate → Fix → Report | Inspector, Fixer, Debug-Reporter |
| **Prober** | 🧠 Reasoning | Security audit — Trace → Patch → Audit | Tracer, Patcher, Auditor, Probe-Reporter |

---

## Agent Workflows

### 🎼 Composer — Feature Work

Composer is the **single entry point for all feature work**. It runs 3 strict, one-directional phases. Phase direction is one-way — no going back without explicit user instruction.

```
You describe a feature / idea
        │
        ▼
  ┌─────────────────────────────────────────┐
  │  EXPLORE PHASE  (mandatory start)       │
  │                                         │
  │  Delegate: Researcher                   │
  │  → deep codebase + web fact-finding     │
  │  → confirmed_facts / inferred_facts /   │
  │    unknowns / risks                     │
  │                                         │
  │  Composer internally assesses:          │
  │  Is this feature simple or complex?     │
  └──────────┬──────────────────────────────┘
             │
    ┌────────┴────────┐
    │ Simple feature  │  Complex feature
    ▼                 ▼
GUARDRAIL GATE 1a  GUARDRAIL GATE 1b
"Build directly?"  "Write a PRD?"
    │                 │
    │ Yes             │ Yes
    │                 ▼
    │          ┌──────────────────────────────┐
    │          │  PLAN PHASE                  │
    │          │                              │
    │          │  Plan-Writer → docs/plans/   │
    │          │  Plan-Checker validates PRD  │
    │          │  PASS/FAIL + gap list only   │
    │          │                              │
    │          │  FAIL → surface gaps to you  │
    │          │  (max 5 loops)               │
    │          │                              │
    │          │  PASS → GUARDRAIL GATE 2     │
    │          │  "Build from this PRD?"      │
    │          └──────────┬───────────────────┘
    │                     │ Yes
    └──────────┬──────────┘
               ▼
  ┌────────────────────────────────────────────┐
  │  BUILD PHASE                               │
  │                                            │
  │  Coder → implements from PRD / request     │
  │     │                                      │
  │     ▼                                      │
  │  Tester → PASS/FAIL/BLOCKED                │
  │     │ FAIL → back to Coder (max 5 loops)   │
  │     │ PASS ↓                               │
  │     ▼                                      │
  │  Reviewer → PASS/FAIL + gap list           │
  │     │ FAIL → back to Coder (max 5 loops)   │
  │     │ PASS ↓                               │
  │     ▼                                      │
  │  Compose-Reporter → docs/reports/          │
  └────────────────────────────────────────────┘
               │
               ▼
         You review result
               │
  Composer resets → asks: New feature? Debug? Iterate?
```

**Key rules:**
- Composer has **no read/write/bash permissions** — all work delegated to subagents
- Phase transition only via guardrail gates — no skipping
- `Coder → Coder` loops without Tester verification are forbidden
- 5 consecutive FAILs from Tester or Reviewer → surfaces to you

---

### 🐛 Debugger — Bug Investigation

Debugger is a **standalone primary agent** — does not depend on Composer. Trigger it directly from the Debugger tab whenever you find a bug.

```
You report a bug / defect
        │
        ▼
  ┌─────────────────────────────────────────────┐
  │  INVESTIGATE PHASE                          │
  │                                             │
  │  Delegate: Inspector                        │
  │  Review mode (Debugger selects):            │
  │  · PR Review        → classify R1-R6        │
  │  · Architecture     → dependency analysis   │
  │  · Tech Debt        → Pain × Spread score   │
  │  · Test Quality     → classify T1-T6        │
  │                                             │
  │  Output: Iron Law chain per finding         │
  │  Symptom → Source → Consequence → Remedy    │
  └──────────┬──────────────────────────────────┘
             │
    Root cause identified?
    ┌────────┴────────┐
    │ Yes             │ No / unknowns remain
    ▼                 ▼
  ┌─────────────┐  Halt — surface to you
  │  FIX PHASE  │  with specific questions
  │             │
  │  Delegate:  │
  │  Fixer      │
  │  → minimal  │
  │    fix per  │
  │  Iron Law   │
  └──────┬──────┘
         │
         ▼
  ┌──────────────────────────────────────┐
  │  REPORT PHASE                        │
  │                                      │
  │  Delegate: Debug-Reporter            │
  │  → Iron Law diagnosis report         │
  │  → saved to docs/reports/            │
  └──────────────────────────────────────┘
         │
         ▼
   You review the diagnosis + fix
         │
  Debugger resets → asks: New bug? Feature work? Re-investigate?
```

**Key rules:**
- Debugger has **no read/write/bash permissions** — all delegated to subagents
- Never delegates Fixer without Inspector confirming root cause first
- If unknowns remain after investigation → halts and prompts you, does not guess

---

### 🔍 Prober — Security Audit

Prober is a **standalone primary agent** — does not depend on Composer or Debugger. Trigger it directly from the Prober tab to audit any codebase for security vulnerabilities and quality decay.

```
You trigger a security audit
        │
        ▼
  ┌───────────────────────────────────────────────────┐
  │  TRACE PHASE  (mandatory start)                   │
  │                                                   │
  │  Delegate: Tracer                                 │
  │  → WSTG-guided breadth-first recon                │
  │  → trace data flows: input → path → sink          │
  │                                                   │
  │  Output:                                          │
  │  · Confirmed Vulnerabilities  (OWASP category,    │
  │    location, data flow)                           │
  │  · Suspected Vulnerabilities  (manual verify)     │
  │  · Quality & Decay Risks      (e.g. hardcoded     │
  │    secrets, missing input validation)             │
  └──────────┬────────────────────────────────────────┘
             │
             ▼
      GUARDRAIL GATE (question tool):
      "Audit findings ready. How to proceed?"
      ├── "Patch all confirmed findings"    → PATCH PHASE
      ├── "Select specific findings"        → PATCH PHASE (you pick)
      ├── "Audit only — no patches"         → AUDIT PHASE (skip PATCH)
      └── "Re-investigate attack surface"  → re-delegate Tracer
             │
             ▼
  ┌──────────────────────────────────────────────────┐
  │  PATCH PHASE  (skipped if audit-only)            │
  │                                                  │
  │  Delegate: Patcher                               │
  │  → Ponytail mindset: smallest correct diff       │
  │  → prefer deleting the cause over wrapping it    │
  │  → escalates to you if patch > 10 lines          │
  └──────────┬───────────────────────────────────────┘
             │
             ▼
  ┌──────────────────────────────────────────────────┐
  │  AUDIT PHASE  (max 5 loops)                      │
  │                                                  │
  │  Delegate: Auditor                               │
  │  → verify patch resolved vulnerabilities         │
  │  → security regression check                     │
  │  → Ponytail BLOAT analysis (over-engineering)    │
  │                                                  │
  │  PASS → proceed to report                        │
  │  FAIL → re-delegate Patcher with Gap + BLOAT     │
  │         lists verbatim (max 5 loops, then you)   │
  │                                                  │
  │  Delegate: Probe-Reporter                        │
  │  → security audit report → docs/reports/         │
  └──────────────────────────────────────────────────┘
             │
             ▼
       You review the audit report
             │
  Prober resets → asks: New audit? Feature work? Bug investigation?
```

**Key rules:**
- Prober has **no read/write/bash permissions** — all delegated to subagents
- TRACE phase is always mandatory — no patching without recon first
- GUARDRAIL GATE required before any patches are applied
- 5 consecutive AUDIT FAILs → surfaces to you

---

## Subagent Reference

Each subagent belongs to exactly one primary agent and cannot be invoked by anyone else:

| Primary | Phase | Subagent | Model Tier | Role |
|---------|-------|----------|------------|------|
| Composer | EXPLORE | Researcher | 🧠 Reasoning | Fact-finding: confirmed_facts / inferred_facts / unknowns / risks |
| Composer | PLAN | Plan-Writer | ⚡ Fast | **Formatter** — writes PRD to `docs/plans/`, missing input = TBD |
| Composer | PLAN | Plan-Checker | 🧠 Reasoning | **Gate** — PASS/FAIL + gap list only, no suggestions |
| Composer | BUILD | Coder | ⚡ Fast | Implements code from PRD |
| Composer | BUILD | Tester | 🎯 Precision | PASS/FAIL/BLOCKED + coverage gaps only |
| Composer | BUILD | Reviewer | 🎯 Precision | **Gate** — PASS/FAIL + gap list only, no suggestions |
| Composer | BUILD | Compose-Reporter | ⚡ Fast | **Formatter** — completion report to `docs/reports/` |
| Debugger | INVESTIGATE | Inspector | 🧠 Reasoning | Brooks-Lint RCA (Iron Law + 6 decay risks + 4 review modes) |
| Debugger | FIX | Fixer | ⚡ Fast | Minimal, root-cause-targeted fix |
| Debugger | REPORT | Debug-Reporter | ⚡ Fast | **Formatter** — Iron Law diagnosis report to `docs/reports/` |
| Prober | TRACE | Tracer | 🎯 Precision | WSTG recon + vuln path tracing, no remedies |
| Prober | PATCH | Patcher | ⚡ Fast | Minimal, security-targeted fix (Ponytail, max 10 lines) |
| Prober | AUDIT | Auditor | 🎯 Precision | **Gate** — PASS/FAIL + Gap List + BLOAT List only |
| Prober | AUDIT | Probe-Reporter | ⚡ Fast | **Formatter** — security audit report to `docs/reports/` |

---

## Flow Rules

| Rule | Detail |
|------|--------|
| **Mandatory starts** | Composer always starts in EXPLORE. Prober always starts in TRACE. No skipping. |
| **Guardrail gates** | Composer: Gate 1 (EXPLORE→PLAN/BUILD), Gate 2 (PLAN→BUILD). Prober: Gate after TRACE. All require user confirmation. |
| **Gate agents** | Plan-Checker, Reviewer, Auditor — PASS/FAIL + gap list only. No suggestions, no decisions. |
| **Formatter agents** | Plan-Writer, Compose-Reporter, Debug-Reporter, Probe-Reporter — stateless. Missing input = TBD/NA. Never invent content. |
| **Fact-finding agents** | Researcher, Inspector, Tracer — facts/inferences/risks only. No recommendations. |
| **Build gate order** | Coder → Tester → Reviewer → Compose-Reporter. No skipping. No Coder→Coder without verification. |
| **FAIL loops** | Plan-Checker FAIL: max 5 loops. Build FAIL (Tester/Reviewer): max 5 loops. Prober AUDIT FAIL: max 5 loops. All surface to you after limit. |
| **Output directories** | PRDs → `docs/plans/`. Reports (Compose-Reporter, Debug-Reporter, Probe-Reporter) → `docs/reports/`. Enforced by permissions. |
| **Independence** | Debugger and Prober are fully standalone — triggered directly, do not flow through Composer. |

---

## Brooks-Lint Methodology (Debugger)

The Debugger pipeline uses the [Brooks-Lint](https://hyhmrright.github.io/brooks-lint/guide.html) framework:

- **Iron Law** per finding: Symptom → Source → Consequence → Remedy
- **6 Decay Risks (R1–R6)**: Cognitive Overload, Change Propagation, Knowledge Duplication, Accidental Complexity, Dependency Disorder, Domain Model Distortion
- **4 Review Modes**: PR Review (R1–R6), Architecture Audit, Tech Debt Assessment (Pain × Spread), Test Quality (T1–T6)
- **T1–T6 Test Risks**: Test Obscurity, Brittleness, Duplication, Mock Abuse, Coverage Illusion, Architecture Mismatch

## Principle Hierarchy

All agents resolve conflicts using this priority order (defined in `hierarchy.txt`):

1. **PRD / Spec** — explicit requirement text
2. **Verdict** — Reviewer / Plan-Checker / Auditor PASS/FAIL
3. **Engineering principles** — Fail Fast, Single Responsibility
4. **Heuristics** — KISS, DRY, SOLID, Law of Demeter
5. **Local optimization** — style preference

---

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

Prompts you to select models for three agent tiers (reasoning, precision, and fast), then:

- Asks whether to install the pluidr-squeeze plugin (can decline)
- Builds a complete `opencode.jsonc` config with the chosen models injected into the right agents
- Backs up any existing config to `opencode.jsonc.bak.*`
- Writes the new config to `~/.config/opencode/opencode.jsonc`
- Copies all 18 agent prompt files into `~/.config/opencode/prompts/`
- Copies `pluidr-flow` and `pluidr-squeeze` plugins into `~/.config/opencode/plugins/`
- Writes a `package.json` declaring `@opencode-ai/plugin` as a dependency

### `pluidr doctor`

Checks installation health and reports ✓/✗ for each component:

- `opencode.jsonc` exists
- All 18 prompt files present
- Both plugin files present
- `package.json` with `@opencode-ai/plugin` dependency
- squeeze binary available
- Config is valid JSON

Exits with code `0` if all pass, `1` if any fail.

### `pluidr update`

Re-runs the setup wizard. Warns if existing config is found and asks for confirmation before overwriting.

### `pluidr uninstall`

Restores your previous configuration:

- Finds the latest timestamped backup and restores it to `opencode.jsonc`
- Removes `prompts/`, `plugins/`, and `bin/` directories
- Preserves `opencode.jsonc` and `package.json`

---

## Bundled Plugins

### `pluidr-flow`

Provides subagents with cross-session context access:

- `parent_session_messages` — read the parent session's transcript
- `session_messages(sessionId)` — read any session by ID
- `session_messages_batch(sessionIds)` — read multiple sessions in one call

### `pluidr-squeeze`

Hooks into tool execution to rewrite bash commands through the `squeeze` binary, filtering verbose output and saving **60–90% of tokens** across all agents.

Both plugins and their dependency declaration are installed automatically by `pluidr init` — no extra user action required. On OpenCode's first launch, the bundled Bun runtime installs `@opencode-ai/plugin` from the generated `package.json`.
