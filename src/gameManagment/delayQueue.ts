type Handler<T> = (item: T) => Promise<void> | void;

export class DelayQueue<T> {
  private q: { dueAt: number; item: T }[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(private delayMs: number, private handle: Handler<T>) {}

  enqueue(item: T) {
    const dueAt = Date.now() + this.delayMs;
    this.q.push({ dueAt, item });        // FIFO append
    if (this.q.length === 1) this.schedule(); // only schedule when going from 0 -> 1
  }

  private schedule() {
    if (this.q.length === 0) return;
    const head = this.q[0];                             // earliest
    const delay = Math.max(0, head.dueAt - Date.now()); // sleep until due
    this.timer = setTimeout(this.fire, delay);
  }

  private fire = async () => {
    this.timer = null;
    const now = Date.now();

    // Drain all items that are due (handles bursts)
    while (this.q.length && this.q[0].dueAt <= now) {
      const { item } = this.q.shift()!;
      try { await this.handle(item); } catch (e) { /* log/retry */ }
    }

    // If more items are scheduled in the future, sleep until the next one
    if (this.q.length) this.schedule();
  };

  // Optional helpers
  clear() { if (this.timer) clearTimeout(this.timer); this.timer = null; this.q = []; }
  size() { return this.q.length; }
}
