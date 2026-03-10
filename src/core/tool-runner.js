export class ToolRunner {
  constructor({ registry }) {
    this.registry = registry;
  }

  async run(name, input) {
    const tool = this.registry.getTool(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    return tool.execute(input);
  }
}
