export class Orchestrator {
  constructor({ registry, logger, memory, contextFactory = null }) {
    this.registry = registry;
    this.logger = logger;
    this.memory = memory;
    this.contextFactory = contextFactory;
  }

  async execute(task) {
    const agents = this.registry.findAgents(task);
    if (!agents.length) {
      throw new Error(`No agents found for task: ${task.id}`);
    }

    const baseContext = {
      memory: this.memory.getRecent(),
      tools: this.registry.listTools(),
      tags: task.tags
    };
    const context = this.contextFactory ? await this.contextFactory(baseContext, task) : baseContext;

    this.logger.info(`Task ${task.id} matched ${agents.length} agent(s)`);

    const results = [];
    for (const agent of agents) {
      const result = await agent.run(task, context);
      results.push(result);
      this.memory.append({
        type: 'execution',
        taskId: task.id,
        agentId: agent.id,
        summary: result.summary,
        createdAt: new Date().toISOString()
      });
    }

    return {
      task,
      results,
      executedAt: new Date().toISOString()
    };
  }
}
