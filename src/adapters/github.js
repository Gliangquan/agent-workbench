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
}
