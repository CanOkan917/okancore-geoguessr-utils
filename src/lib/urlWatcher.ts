type ResetCallback = () => void;

export function watchURL(onReset: ResetCallback): void {
  const gameRe = /\/(game|challenge)\/([\w-]+)/;
  let prevId = (location.href.match(gameRe) ?? [])[2];

  new MutationObserver(() => {
    const id = (location.href.match(gameRe) ?? [])[2];
    if (id === prevId) return;
    prevId = id;
    onReset();
  }).observe(document, { subtree: true, childList: true });
}
