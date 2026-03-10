export class JobRunner {
  constructor({ scheduler, handlers = {}, logger }) {
    this.scheduler = scheduler;
    this.handlers = handlers;
    this.logger = logger;
  }

  async runDueJobs(now = new Date()) {
    const dueJobs = this.scheduler.getDueJobs(now);
    const results = [];

    for (const job of dueJobs) {
      const handler = this.handlers[job.handler];
      if (!handler) {
        this.logger.error(`No handler registered for job ${job.id}`, { jobId: job.id, handler: job.handler });
        continue;
      }

      this.logger.info(`Running job ${job.id}`, { jobId: job.id, handler: job.handler });
      const output = await handler(job);
      this.scheduler.markRun(job.id, now);
      results.push({ jobId: job.id, output });
    }

    return results;
  }
}
