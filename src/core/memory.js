import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

export class MemoryStore {
  constructor({ filePath = new URL('../../data/memory.json', import.meta.url) } = {}) {
    this.filePath = filePath;
    this.items = [];
    this.ensureLoaded();
  }

  ensureLoaded() {
    try {
      const raw = readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(raw);
      this.items = Array.isArray(parsed.items) ? parsed.items : [];
    } catch {
      this.items = [];
      this.flush();
    }
  }

  append(item) {
    this.items.push(item);
    this.flush();
  }

  getRecent(limit = 10) {
    return this.items.slice(-limit);
  }

  flush() {
    mkdirSync(new URL('../../data/', import.meta.url), { recursive: true });
    writeFileSync(this.filePath, JSON.stringify({ items: this.items }, null, 2) + '\n');
  }
}
