// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win: any = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

type CoordsCallback = (coords: { lat: number; lng: number }) => void;

export function hookStreetView(onCoords: CoordsCallback): {
  reset: () => void;
  redetect: () => void;
} {
  const resetFns: Array<() => void> = [];
  const redetectFns: Array<() => void> = [];

  function tryHook() {
    if (!win.google?.maps?.StreetViewPanorama) {
      setTimeout(tryHook, 150);
      return;
    }

    const seen = new WeakSet();

    function attach(pano: google.maps.StreetViewPanorama) {
      if (seen.has(pano)) return;
      seen.add(pano);

      let lastCapturedPanoId: string | null = null;
      let debounceTimer: ReturnType<typeof setTimeout> | null = null;

      function captureIfNew() {
        const pos = pano.getPosition?.();
        if (!pos) return;
        const panoId = pano.getPano?.() || `${pos.lat().toFixed(5)},${pos.lng().toFixed(5)}`;
        if (panoId === lastCapturedPanoId) return;
        lastCapturedPanoId = panoId;
        onCoords({ lat: pos.lat(), lng: pos.lng() });
      }

      resetFns.push(() => { lastCapturedPanoId = null; });

      redetectFns.push(() => {
        lastCapturedPanoId = null;
        captureIfNew();
      });

      pano.addListener('pano_changed', () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(captureIfNew, 300);
      });

      // Catch panoramas already loaded before we attached (SPA nav, first round)
      setTimeout(captureIfNew, 500);
    }

    const OrigPanorama = win.google.maps.StreetViewPanorama;
    win.google.maps.StreetViewPanorama = new Proxy(OrigPanorama, {
      construct(
        Target: typeof OrigPanorama,
        args: ConstructorParameters<typeof OrigPanorama>,
        NewTarget: typeof OrigPanorama,
      ) {
        const inst = Reflect.construct(Target, args, NewTarget) as google.maps.StreetViewPanorama;
        setTimeout(() => attach(inst), 200);
        return inst;
      },
    });

    const origAddListener = win.google.maps.StreetViewPanorama.prototype.addListener;
    win.google.maps.StreetViewPanorama.prototype.addListener = function (
      this: google.maps.StreetViewPanorama,
      ...args: unknown[]
    ) {
      attach(this);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return origAddListener.apply(this, args as any);
    };
  }

  tryHook();

  return {
    reset: () => resetFns.forEach(fn => fn()),
    redetect: () => redetectFns.forEach(fn => fn()),
  };
}
