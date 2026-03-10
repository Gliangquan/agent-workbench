export class MemoryStore {
  constructor() {
    this.items = [];
  }

  append(item) {
    this.items.push(item);
  }

  getRecent(limit = 10) {
    return this.items.slice(-limit);
  }
}
