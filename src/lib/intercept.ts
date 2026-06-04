import type { GameData } from '../types';
import { dbg } from './debugStore';

type Handler = (data: GameData) => void;

const GAME_RE = /\/api\/v[34]\/[\w-]+\/[\w-]+/;
const GUESS_RE = /\/api\/v[34]\/(games|duels|live-challenges|team-duels|battle-royale)\/[\w-]+/;
const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

function logUrl(url: string) {
  if (/\/api\//.test(url)) {
    const path = url.replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, '');
    dbg(`fetch: ${path}`, { lastApiUrl: path });
  }
}

export function setupIntercepts(onData: Handler, onRoundPost?: () => void): void {
  const origFetch = (win as Window).fetch;
  (win as Window).fetch = async function (...args: Parameters<typeof fetch>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = typeof args[0] === 'string' ? args[0] : ((args[0] as Request)?.url ?? '');
    const method = (typeof args[1] === 'object' && args[1] !== null
      ? (args[1] as RequestInit).method
      : undefined) ?? 'GET';
    const res = await origFetch.apply(this, args as Parameters<typeof fetch>);
    logUrl(url);
    if (/^(POST|PUT|PATCH)$/i.test(method) && GUESS_RE.test(url)) onRoundPost?.();
    if (GAME_RE.test(url)) res.clone().json().then(onData).catch(() => {});
    return res;
  };

  const origOpen = win.XMLHttpRequest.prototype.open;
  const origSend = win.XMLHttpRequest.prototype.send;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (win.XMLHttpRequest.prototype as any).open = function (method: string, url: string, ...rest: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)._ogu_url = url;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)._ogu_method = method;
    return origOpen.apply(this, [method, url, ...rest] as Parameters<typeof origOpen>);
  };

  win.XMLHttpRequest.prototype.send = function (...args: Parameters<XMLHttpRequest['send']>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url: string = (this as any)._ogu_url ?? '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const method: string = (this as any)._ogu_method ?? 'GET';
    logUrl(url);
    if (/^(POST|PUT|PATCH)$/i.test(method) && GUESS_RE.test(url)) onRoundPost?.();
    if (url && GAME_RE.test(url)) {
      this.addEventListener('load', () => {
        try { onData(JSON.parse(this.responseText) as GameData); } catch {}
      });
    }
    return origSend.apply(this, args);
  };
}

export function checkNextData(onData: Handler): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nextData = (win as any).__NEXT_DATA__;
    if (!nextData) return;
    const pageProps = nextData?.props?.pageProps;
    if (!pageProps) return;
    for (const val of Object.values(pageProps)) {
      const candidate = val as GameData;
      if (candidate?.rounds?.length) {
        dbg('nextData → rounds found', { lastApiUrl: '__NEXT_DATA__' });
        onData(candidate);
        return;
      }
      if (val && typeof val === 'object') {
        for (const inner of Object.values(val as object)) {
          const c = inner as GameData;
          if (c?.rounds?.length) {
            dbg('nextData → nested rounds found', { lastApiUrl: '__NEXT_DATA__' });
            onData(c);
            return;
          }
        }
      }
    }
  } catch {}
}
