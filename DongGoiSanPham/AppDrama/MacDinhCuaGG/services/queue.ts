/**
 * Global Rolling Queue for Flow API image generation.
 *
 * Enforces a strict global concurrency limit without using complex
 * semaphore locking. When multiple views or actions trigger autofill
 * concurrently, their items are pushed to this global queue and
 * processed 2 at a time globally.
 */
class GlobalRollingQueue {
  private queue: {
    task: () => Promise<void>;
    signal: AbortSignal;
    resolve: () => void;
    reject: (e: any) => void;
  }[] = [];
  private activeWorkers = 0;
  private concurrency = 2;
  private readonly SLOT_COOLDOWN_MS = 200;
  async enqueue(task: () => Promise<void>, signal: AbortSignal): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.queue.push({ task, signal, resolve, reject });
      this.processNext();
    });
  }
  private async processNext() {
    if (this.activeWorkers >= this.concurrency || this.queue.length === 0) return;
    // Flush any aborted tasks immediately
    while (this.queue.length > 0 && this.queue[0].signal.aborted) {
      const skipped = this.queue.shift()!;
      skipped.resolve();
    }
    if (this.queue.length === 0) return;
    this.activeWorkers++;
    const current = this.queue.shift()!;
    try {
      if (!current.signal.aborted) {
        await current.task();
      }
      current.resolve();
    } catch (e) {
      current.reject(e);
    } finally {
      this.activeWorkers--;
      // Small cooldown to spread API pressure
      setTimeout(() => this.processNext(), this.SLOT_COOLDOWN_MS);
    }
  }
}
const globalImagePool = new GlobalRollingQueue();
/**
 * Wait for ALL currently in-flight slots to finish.
 * (Deprecated: kept as no-op for backward compatibility)
 */
export function waitForDrain(): Promise<void> {
  return Promise.resolve();
}
/**
 * Run an async function gated by the global semaphore.
 * (Deprecated: kept for backward compatibility, now just runs the function)
 */
export async function withSlot<T>(fn: () => Promise<T>): Promise<T> {
  return await fn();
}
/**
 * Rolling concurrency pool — maintains a global active worker limit.
 * All items passed here are pushed to the global queue, ensuring
 * that even concurrent calls to `runRollingQueue` don't exceed the global limit.
 *
 * @param items - Array of items to process
 * @param worker - Async function to process each item. Receives the item AND the abort signal.
 * @param concurrency - Max simultaneous workers (ignored in favor of global concurrency=2)
 * @param signal - AbortSignal to cancel pending items AND passed into each worker
 * @param onProgress - Called after each item completes with (completed, failed) counts
 */
export async function runRollingQueue<T>(
  items: T[],
  worker: (item: T, signal: AbortSignal) => Promise<void>,
  concurrency: number,
  signal: AbortSignal,
  onProgress: (completed: number, failed: number) => void,
  manageSlots: boolean = true
): Promise<{ completed: number; failed: number }> {
  let completed = 0;
  let failed = 0;
  const promises = items.map(async (item) => {
    if (signal.aborted) return;
    try {
      await globalImagePool.enqueue(async () => {
        if (signal.aborted) return;
        await worker(item, signal);
      }, signal);
      
      if (signal.aborted) return;
      completed++;
      onProgress(completed, failed);
    } catch (err) {
      if (signal.aborted) return;
      console.error('Queue item failed:', err);
      failed++;
      onProgress(completed, failed);
    }
  });
  await Promise.all(promises);
  return { completed, failed };
}
/**
 * Retry an async function with exponential backoff.
 * Waits 2s, then 4s (with random jitter) between attempts.
 * Respects an optional AbortSignal to bail early.
 *
 * IMPORTANT: Timeout errors (180s) and rate-limit errors (429) are NOT retried
 * because they indicate server-side conditions that won't resolve in seconds.
 * Only transient errors (network blips, 500s) are retried.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  signal?: AbortSignal
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (signal?.aborted) throw new Error('Aborted');
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      // Don't retry if aborted
      if (signal?.aborted) throw err;
      // Don't retry non-transient errors — these won't resolve with a quick retry
      const msg = (err?.message || '').toLowerCase();
      const isTimeout = msg.includes('timed out') || msg.includes('timeout');
      const isRateLimit = msg.includes('429') || msg.includes('rate limit') || msg.includes('quota');
      const isContentFilter = msg.includes('blocked') || msg.includes('safety') || msg.includes('filtered');
      if (isTimeout || isRateLimit || isContentFilter) {
        throw err; // Fail fast — don't waste another 180s
      }
      if (attempt < maxRetries) {
        // Exponential backoff: 2s, 4s (with jitter to spread out retries)
        const baseDelay = 2000 * Math.pow(2, attempt);
        const jitter = Math.random() * 1000;
        await new Promise(r => setTimeout(r, baseDelay + jitter));
      }
    }
  }
  throw lastError;
}