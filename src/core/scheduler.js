import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

export class Scheduler {
  constructor({ logger, filePath = new URL('../../data/jobs.json', import.meta.url) }) {
    this.logger = logger;
    this.filePath = filePath;
    this.jobs = [];
    this.load();
  }

  load() {
    try {
      const raw = readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(raw);
      this.jobs = Array.isArray(parsed.jobs) ? parsed.jobs : [];
    } catch {
      this.jobs = [];
      this.flush();
    }
  }

  add(job) {
    const existing = this.jobs.find((item) => item.id === job.id);
    if (existing) {
      Object.assign(existing, job);
    } else {
      this.jobs.push({ ...job, createdAt: new Date().toISOString(), lastRunAt: null });
    }
    this.flush();
    this.logger.info(`Registered job: ${job.id}`);
  }

  markRun(jobId, date = new Date()) {
    const job = this.jobs.find((item) => item.id === jobId);
    if (!job) return;
    job.lastRunAt = date.toISOString();
    this.flush();
  }

  getDueJobs(now = new Date()) {
    return this.jobs.filter((job) => this.isDue(job, now));
  }

  isDue(job, now) {
    if (job.kind === 'every') {
      const intervalMs = parseEvery(job.expr);
      if (!intervalMs) return false;
      if (!job.lastRunAt) return true;
      return now.getTime() - new Date(job.lastRunAt).getTime() >= intervalMs;
    }

    if (job.kind === 'at') {
      if (job.lastRunAt) return false;
      return now.getTime() >= new Date(job.expr).getTime();
    }

    return false;
  }

  list() {
    return this.jobs;
  }

  flush() {
    mkdirSync(new URL('../../data/', import.meta.url), { recursive: true });
    writeFileSync(this.filePath, JSON.stringify({ jobs: this.jobs }, null, 2) + '\n');
  }
}

function parseEvery(expr) {
  const match = String(expr).trim().match(/^(\d+)([smhd])$/);
  if (!match) return null;
  const value = Number(match[1]);
  const unit = match[2];
  const map = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * map[unit];
}
