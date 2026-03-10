export class Scheduler {
  constructor({ logger }) {
    this.logger = logger;
    this.jobs = [];
  }

  add(job) {
    this.jobs.push(job);
    this.logger.info(`Registered job: ${job.id}`);
  }

  list() {
    return this.jobs;
  }
}
