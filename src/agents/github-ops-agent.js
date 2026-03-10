export function createGitHubOpsAgent() {
  return {
    id: 'github-ops-1',
    name: 'GitHub Ops Agent',
    role: 'Inspect repositories and generate operational reports',
    capabilities: ['github', 'analysis', 'reporting'],
    async handler(task, context) {
      const fullName = task.input?.repository ?? 'Gliangquan/agent-workbench';
      const policy = context.policy.evaluate('github.inspect', { fullName });
      if (!policy.allowed) {
        return {
          agentId: 'github-ops-1',
          taskId: task.id,
          summary: `Policy blocked inspection for ${fullName}`,
          policy
        };
      }

      const repo = await context.toolRunner.run('github.inspect', { fullName });
      const report = await context.toolRunner.run('report.generate', { repo });

      return {
        agentId: 'github-ops-1',
        taskId: task.id,
        summary: `Generated GitHub ops report for ${fullName}`,
        policy,
        report
      };
    }
  };
}
