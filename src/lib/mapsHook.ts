// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win: any = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

type MapCallback = (map: google.maps.Map) => void;

export function hookMaps(onMap: MapCallback): void {
  function tryHook() {
    if (!win.google?.maps?.Map) {
      setTimeout(tryHook, 150);
      return;
    }

    const seen = new WeakSet<google.maps.Map>();

    function dispatch(inst: google.maps.Map) {
      if (seen.has(inst)) return;
      seen.add(inst);
      setTimeout(() => onMap(inst), 300);
    }

    // Catch maps created after this point
    const OrigMap = win.google.maps.Map;
    win.google.maps.Map = new Proxy(OrigMap, {
      construct(Target: typeof OrigMap, args: ConstructorParameters<typeof OrigMap>, NewTarget: typeof OrigMap) {
        const inst = Reflect.construct(Target, args, NewTarget) as google.maps.Map;
        dispatch(inst);
        return inst;
      },
    });

    // Catch maps already created (SPA navigation, live-challenge, duels)
    const origAddListener = win.google.maps.Map.prototype.addListener;
    win.google.maps.Map.prototype.addListener = function(this: google.maps.Map, ...args: unknown[]) {
      dispatch(this);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return origAddListener.apply(this, args as any);
    };
  }

  tryHook();
}
