export class PolicyEngine {
  constructor({ rules = [] } = {}) {
    this.rules = rules;
  }

  evaluate(action, input = {}) {
    for (const rule of this.rules) {
      if (rule.when(action, input)) {
        return {
          action,
          allowed: rule.allow,
          reason: rule.reason
        };
      }
    }

    return {
      action,
      allowed: true,
      reason: 'No blocking policy matched'
    };
  }
}

export function createDefaultPolicyEngine() {
  return new PolicyEngine({
    rules: [
      {
        allow: false,
        reason: 'Deleting repositories is blocked by default',
        when(action) {
          return action === 'github.deleteRepo';
        }
      },
      {
        allow: false,
        reason: 'Direct pushes to protected branches are blocked by default',
        when(action, input) {
          return action === 'github.push' && ['main', 'master'].includes(input.branch);
        }
      }
    ]
  });
}
