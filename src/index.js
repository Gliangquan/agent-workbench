import { readFileSync } from 'node:fs';
import { Agent } from './core/agent.js';
import { Registry } from './core/registry.js';
import { MemoryStore } from './core/memory.js';
import { Scheduler } from './core/scheduler.js';
import { Orchestrator } from './core/orchestrator.js';
import { ToolRunner } from './core/tool-runner.js';
import { Planner } from './core/planner.js';
import { createDefaultPolicyEngine } from './core/policy.js';
import { Logger } from './runtime/logger.js';
import { GitHubAdapter } from './adapters/github.js';
import { createGitHubOpsAgent } from './agents/github-ops-agent.js';

const logger = new Logger();
const registry = new Registry();
const memory = new MemoryStore();
const scheduler = new Scheduler({ logger });
const planner = new Planner();
const policy = createDefaultPolicyEngine();
const github = new GitHubAdapter();

registry.registerTool({
  name: 'github.inspect',
  async execute({ fullName }) {
    return github.inspectRepo(fullName);
  }
});

registry.registerTool({
  name: 'report.generate',
  async execute({ repo }) {
    return {
      title: `GitHub ops report: ${repo.fullName}`,
      bullets: [
        `Description: ${repo.description || 'N/A'}`,
        `Stars: ${repo.stars}`,
        `Forks: ${repo.forks}`,
        `Open issues: ${repo.openIssues}`,
        `Language: ${repo.language || 'Unknown'}`,
        `Default branch: ${repo.defaultBranch}`,
        `Updated at: ${repo.updatedAt}`,
        `URL: ${repo.url}`
      ]
    };
  }
});

registry.registerTool({
  name: 'memory.append',
  async execute({ item }) {
    memory.append(item);
    return { ok: true };
  }
});

const toolRunner = new ToolRunner({ registry });
const orchestrator = new Orchestrator({
  registry,
  logger,
  memory,
  planner,
  contextFactory(baseContext) {
    return {
      ...baseContext,
      toolRunner,
      policy
    };
  }
});

const githubOps = createGitHubOpsAgent();
registry.registerAgent(new Agent(githubOps));
registry.registerAgent(
  new Agent({
    id: 'reporter-1',
    name: 'Reporter',
    role: 'Summarize outputs for humans',
    capabilities: ['reporting'],
    async handler(task, context) {
      await context.toolRunner.run('memory.append', {
        item: {
          type: 'reporting',
          taskId: task.id,
          summary: `Reporter prepared summary for ${task.id}`,
          createdAt: new Date().toISOString()
        }
      });

      return {
        agentId: 'reporter-1',
        taskId: task.id,
        summary: `Reporter prepared summary for ${task.id}`,
        planSummary: context.plan?.summary ?? null
      };
    }
  })
);

scheduler.add({
  id: 'daily-github-digest',
  kind: 'cron',
  expr: '0 8 * * *'
});

const task = JSON.parse(readFileSync(new URL('../examples/demo-task.json', import.meta.url), 'utf8'));
const result = await orchestrator.execute(task);

logger.info('Execution complete', {
  taskId: task.id,
  jobCount: scheduler.list().length,
  memoryItems: memory.getRecent().length
});
console.log(JSON.stringify({ jobs: scheduler.list(), result, memory: memory.getRecent() }, null, 2));
