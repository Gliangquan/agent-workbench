export class Planner {
  build(task, registry) {
    const matchedAgents = registry.findAgents(task).map((agent) => agent.id);
    const toolSuggestions = [];

    if (task.tags.includes('github')) {
      toolSuggestions.push('github.inspect');
    }
    if (task.tags.includes('reporting')) {
      toolSuggestions.push('report.generate');
    }
    if (task.tags.includes('memory')) {
      toolSuggestions.push('memory.append');
    }

    return {
      taskId: task.id,
      summary: `Plan for ${task.title}`,
      matchedAgents,
      toolSuggestions,
      steps: [
        'Build execution context',
        'Run matched agents',
        'Persist execution notes',
        'Return aggregated result'
      ]
    };
  }
}
