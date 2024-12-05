import { Queue } from 'bullmq';

export class MonitoringService {
  private static instance: MonitoringService;
  private queues: Map<string, Queue>;

  private constructor() {
    this.queues = new Map();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  registerQueue(name: string, queue: Queue): void {
    this.queues.set(name, queue);
  }

  async getQueueMetrics(): Promise<Record<string, any>> {
    const metrics: Record<string, any> = {};

    for (const [name, queue] of this.queues) {
      metrics[name] = {
        waiting: await queue.getWaitingCount(),
        active: await queue.getActiveCount(),
        completed: await queue.getCompletedCount(),
        failed: await queue.getFailedCount(),
        delayed: await queue.getDelayedCount(),
      };
    }

    return metrics;
  }
}