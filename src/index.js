import { readFileSync } from 'node:fs';
import { Agent } from './core/agent.js';
import { Registry } from './core/registry.js';
import { MemoryStore } from './core/memory.js';
import { Scheduler } from './core/scheduler.js';
import { Orchestrator } from './core/orchestrator.js';
import { Logger } from './runtime/logger.js';

const logger = new Logger();
const registry = new Registry();
const memory = new MemoryStore();
const scheduler = new Scheduler({ logger });
const orchestrator = new Orchestrator({ registry, logger, memory });

registry.registerTool({ name: 'github.inspect' });
registry.registerTool({ name: 'memory.append' });
registry.registerTool({ name: 'report.generate' });

registry.registerAgent(
  new Agent({
    id: 'planner-1',
    name: 'Planner',
    role: 'Break down tasks and route them',
    capabilities: ['analysis', 'github']
  })
);

registry.registerAgent(
  new Agent({
    id: 'reporter-1',
    name: 'Reporter',
    role: 'Summarize outputs for humans',
    capabilities: ['reporting']
  })
);

scheduler.add({
  id: 'daily-github-digest',
  kind: 'cron',
  expr: '0 8 * * *'
});

const task = JSON.parse(readFileSync(new URL('../examples/demo-task.json', import.meta.url), 'utf8'));
const result = await orchestrator.execute(task);

logger.info('Execution complete');
console.log(JSON.stringify({ jobs: scheduler.list(), result }, null, 2));
