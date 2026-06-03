import type { GameData } from '../types';

type Handler = (data: GameData) => void;

const GAME_RE = /\/api\/v3\/games\/[\w-]+/;
const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

export function setupIntercepts(onData: Handler): void {
  // Fetch
  const origFetch = win.fetch;
  win.fetch = async function (...args: Parameters<typeof fetch>) {
    const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url ?? '';
    const res = await origFetch.apply(this, args as Parameters<typeof fetch>);
    if (GAME_RE.test(url)) {
      res.clone().json().then(onData).catch(() => {});
    }
    return res;
  };

  // XHR
  const origOpen = win.XMLHttpRequest.prototype.open;
  const origSend = win.XMLHttpRequest.prototype.send;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (win.XMLHttpRequest.prototype as any).open = function (method: string, url: string, ...rest: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)._ogu_url = url;
    return origOpen.apply(this, [method, url, ...rest] as Parameters<typeof origOpen>);
  };

  win.XMLHttpRequest.prototype.send = function (...args: Parameters<XMLHttpRequest['send']>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((this as any)._ogu_url && GAME_RE.test((this as any)._ogu_url)) {
      this.addEventListener('load', () => {
        try { onData(JSON.parse(this.responseText) as GameData); } catch {}
      });
    }
    return origSend.apply(this, args);
  };
}
