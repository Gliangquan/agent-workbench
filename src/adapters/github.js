export class GitHubAdapter {
  constructor({ token = null } = {}) {
    this.token = token;
  }

  async getRepo(fullName) {
    const response = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers: {
        'User-Agent': 'agent-workbench',
        'Accept': 'application/vnd.github+json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub request failed: ${response.status}`);
    }

    return response.json();
  }

  async inspectRepo(fullName) {
    const repo = await this.getRepo(fullName);
    return {
      fullName: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      language: repo.language,
      defaultBranch: repo.default_branch,
      updatedAt: repo.updated_at,
      url: repo.html_url
    };
  }
}
