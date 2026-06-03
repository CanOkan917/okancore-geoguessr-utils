type Listener<T> = (value: T) => void;

export function createSignal<T>(initial: T) {
  let value = initial;
  const listeners = new Set<Listener<T>>();

  return {
    get(): T { return value; },
    set(next: T): void {
      value = next;
      listeners.forEach(l => l(next));
    },
    subscribe(listener: Listener<T>): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
