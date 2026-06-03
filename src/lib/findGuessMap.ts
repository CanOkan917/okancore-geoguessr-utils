const GUESS_KEYS = ['guess-map', 'game-layout__guess', 'guess_map'];

export function findGuessMap(maps: google.maps.Map[]): google.maps.Map | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visible = (m: google.maps.Map) => !!(m as any).getDiv?.()?.offsetParent;

  for (const m of [...maps].reverse()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const div = (m as any).getDiv?.() as HTMLElement | undefined;
    if (!div?.offsetParent) continue;
    let el: HTMLElement | null = div;
    while (el && el !== document.documentElement) {
      const cls = typeof el.className === 'string' ? el.className : '';
      if (GUESS_KEYS.some(k => cls.includes(k))) return m;
      if (el.dataset?.qa === 'guess-map') return m;
      el = el.parentElement;
    }
  }

  return [...maps].reverse().find(visible) ?? null;
}
