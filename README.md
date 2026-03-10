# Agent Workbench

A multi-agent workbench for orchestration, skills, memory, scheduling, and GitHub operations.

## Positioning

Agent Workbench is designed as a high-end personal/team agent platform inspired by modern agent systems, but focused on practical execution:

- multi-agent orchestration
- skill/tool registry
- memory and knowledge integration
- scheduled automation
- GitHub ops workflows
- readable execution logs

## Why this project exists

Most agent projects look impressive but are hard to customize for real daily work. Agent Workbench aims to be:

- modular enough to grow
- simple enough to understand
- automation-first
- suitable for public iteration

## Core modules

- `src/core/agent.js` — agent contract
- `src/core/orchestrator.js` — task routing and execution loop
- `src/core/registry.js` — skills and tools registry
- `src/core/tool-runner.js` — actual tool execution layer
- `src/core/memory.js` — in-memory + file-backed memory abstraction
- `src/core/scheduler.js` — scheduled task management
- `src/adapters/github.js` — GitHub repository inspection adapter
- `src/agents/github-ops-agent.js` — example GitHub ops agent
- `src/runtime/logger.js` — execution logging
- `src/index.js` — runnable demo entrypoint

## MVP roadmap

### Phase 1
- task model
- agent registry
- orchestration runtime
- pluggable tools
- simple memory store
- scheduler abstraction
- execution logs

### Phase 2
- GitHub adapter
- Web UI / TUI
- long-running agent sessions
- skill marketplace
- knowledge search
- policy and permissions layer

## Project management

- Milestones are now set up directly in GitHub for foundation, automation, multi-agent, and productization phases.
- Roadmap issues are published to make public iteration visible.
- This repo is intended to evolve in the open.

## Example run

```bash
node src/index.js
```

## Repository plan

- `docs/architecture.md` — system design
- `docs/roadmap.md` — implementation phases
- `examples/` — sample agent configurations

## License

MIT
