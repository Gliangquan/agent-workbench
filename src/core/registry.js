export class Registry {
  constructor() {
    this.agents = [];
    this.tools = [];
  }

  registerAgent(agent) {
    this.agents.push(agent);
  }

  registerTool(tool) {
    this.tools.push(tool);
  }

  findAgents(task) {
    return this.agents.filter((agent) => agent.canHandle(task));
  }

  listTools() {
    return this.tools.map((tool) => tool.name);
  }
}
