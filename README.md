# Pluidr

**Plan · Build · Review** — opinionated engineering workflow installer for [OpenCode](https://opencode.ai).

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

## Notes

- **Model id `deepseek-v4-flash-free` is unverified.** This was found via a third-party aggregator only. Verify the exact model id against [opencode.ai/docs/zen](https://opencode.ai/docs/zen) before release. (See `src/templates/model-defaults.json` and `src/core/configBuilder.js`.)
