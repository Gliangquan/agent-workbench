export class Agent {
  constructor({ id, name, role, capabilities = [] }) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.capabilities = capabilities;
  }

  canHandle(task) {
    return this.capabilities.some((capability) => task.tags.includes(capability));
  }

  async run(task, context) {
    return {
      agentId: this.id,
      taskId: task.id,
      summary: `${this.name} reviewed task ${task.id}`,
      contextSnapshot: context
    };
  }
}
