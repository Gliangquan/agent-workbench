import { appendFileSync, mkdirSync } from 'node:fs';

export class Logger {
  constructor({ logPath = new URL('../../data/execution.log', import.meta.url) } = {}) {
    this.logPath = logPath;
    mkdirSync(new URL('../../data/', import.meta.url), { recursive: true });
  }

  info(message, meta = {}) {
    this.write('INFO', message, meta);
  }

  error(message, meta = {}) {
    this.write('ERROR', message, meta);
  }

  write(level, message, meta = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta
    };

    console.log(`[${level}] ${message}`);
    appendFileSync(this.logPath, JSON.stringify(entry) + '\n');
  }
}
