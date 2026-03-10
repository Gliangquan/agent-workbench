export function createGitHubOpsAgent() {
  return {
    id: 'github-ops-1',
    name: 'GitHub Ops Agent',
    role: 'Inspect repositories and generate operational reports',
    capabilities: ['github', 'analysis', 'reporting'],
    async handler(task, context) {
      const fullName = task.input?.repository ?? 'Gliangquan/agent-workbench';
      const repo = await context.toolRunner.run('github.inspect', { fullName });
      const report = await context.toolRunner.run('report.generate', { repo });

      return {
        agentId: 'github-ops-1',
        taskId: task.id,
        summary: `Generated GitHub ops report for ${fullName}`,
        report
      };
    }
  };
}
