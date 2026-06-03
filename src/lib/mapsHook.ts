// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win: any = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

type MapCallback = (map: google.maps.Map) => void;

export function hookMaps(onMap: MapCallback): void {
  function tryHook() {
    if (!win.google?.maps?.Map) {
      setTimeout(tryHook, 150);
      return;
    }

    const OrigMap = win.google.maps.Map;
    win.google.maps.Map = new Proxy(OrigMap, {
      construct(Target: typeof OrigMap, args: ConstructorParameters<typeof OrigMap>, NewTarget: typeof OrigMap) {
        const inst = Reflect.construct(Target, args, NewTarget) as google.maps.Map;
        setTimeout(() => onMap(inst), 300);
        return inst;
      },
    });
  }

  tryHook();
}
