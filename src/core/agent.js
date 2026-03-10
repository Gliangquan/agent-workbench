export class Agent {
  constructor({ id, name, role, capabilities = [], handler = null }) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.capabilities = capabilities;
    this.handler = handler;
  }

  canHandle(task) {
    return this.capabilities.some((capability) => task.tags.includes(capability));
  }

  async run(task, context) {
    if (this.handler) {
      return this.handler(task, context, this);
    }

    return {
      agentId: this.id,
      taskId: task.id,
      summary: `${this.name} reviewed task ${task.id}`,
      contextSnapshot: context
    };
  }
}
