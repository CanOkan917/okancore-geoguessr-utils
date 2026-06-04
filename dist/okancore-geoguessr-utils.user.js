// ==UserScript==
// @name         Okancore GeoGuessr Utils
// @namespace    https://github.com/canokan917/okancore-geoguessr-utils
// @version      1.3.0
// @author       Okancore
// @description  GeoGuessr training tools: circle, lat/lng lines, area bands, and street view hider — all toggleable from a draggable panel
// @homepage     https://github.com/canokan917/okancore-geoguessr-utils#readme
// @homepageURL  https://github.com/canokan917/okancore-geoguessr-utils#readme
// @source       https://github.com/canokan917/okancore-geoguessr-utils.git
// @downloadURL  https://raw.githubusercontent.com/canokan917/okancore-geoguessr-utils/main/dist/okancore-geoguessr-utils.user.js
// @updateURL    https://raw.githubusercontent.com/canokan917/okancore-geoguessr-utils/main/dist/okancore-geoguessr-utils.user.js
// @match        https://www.geoguessr.com/*
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const e=document.createElement("style");e.textContent=o,document.head.append(e)})(" #ogu{position:fixed;top:16px;right:16px;z-index:999999;font-family:Poppins,system-ui,sans-serif;font-size:13px;width:264px;background:#1a1a1a;border:1px solid rgba(255,255,255,.08);border-radius:14px;box-shadow:0 2px 8px #00000080,0 16px 40px #0009;color:#e8e8e8;-webkit-user-select:none;user-select:none}.ogu-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 14px 11px;background:#222;border-bottom:1px solid rgba(255,255,255,.07);border-radius:14px 14px 0 0;cursor:grab}.ogu-hdr:active{cursor:grabbing}.ogu-ttl{font-size:11px;font-weight:700;letter-spacing:.05em;color:#fff;text-transform:uppercase}.ogu-tog{background:none;border:none;cursor:pointer;color:#ffffff73;font-size:18px;line-height:1;padding:0 2px;transition:color .15s}.ogu-tog:hover{color:#fff}.ogu-body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:10px}.ogu-row{display:flex;align-items:center;justify-content:space-between;gap:8px}.ogu-lbl{font-size:12px;font-weight:500;color:#e8e8e899}.ogu-sw{position:relative;display:inline-block;width:38px;height:22px;flex-shrink:0;cursor:pointer}.ogu-sw input{position:absolute;opacity:0;width:0;height:0}.ogu-sw-track{position:absolute;top:0;right:0;bottom:0;left:0;border-radius:11px;background:#ffffff14;border:1px solid rgba(255,255,255,.1);transition:background .2s,border-color .2s}.ogu-sw input:checked+.ogu-sw-track{background:#3b82f64d;border-color:#3b82f6b3}.ogu-sw-thumb{position:absolute;top:4px;left:4px;width:12px;height:12px;border-radius:50%;background:#ffffff47;transition:transform .2s,background .2s;pointer-events:none}.ogu-sw input:checked~.ogu-sw-thumb{transform:translate(16px);background:#3b82f6}.ogu-module{display:flex;flex-direction:column;gap:10px}.ogu-module-hdr{display:flex;align-items:center;justify-content:space-between;gap:10px}.ogu-module-info{display:flex;flex-direction:column;gap:1px;min-width:0}.ogu-module-name{font-size:12px;font-weight:600;color:#e8e8e8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ogu-module-desc{font-size:10px;color:#e8e8e861;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ogu-module-body{display:flex;flex-direction:column;gap:10px}.ogu-lines-opts{display:flex;flex-direction:column;gap:8px}.ogu-line-row{display:flex;align-items:center;gap:8px}.ogu-line-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}.ogu-line-row .ogu-lbl{flex:1}.ogu-band-slider{display:flex;flex-direction:column;gap:6px;padding-left:16px}.ogu-band-val{display:flex;align-items:center;gap:6px;justify-content:flex-end}.ogu-radius{display:flex;flex-direction:column;gap:8px}.ogu-field{display:flex;align-items:center;gap:6px}.ogu-num{width:64px;padding:5px 8px;text-align:right;background:#ffffff0d;border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#e8e8e8;font-family:Poppins,system-ui,sans-serif;font-size:12px;font-weight:500;outline:none;transition:border-color .15s;-moz-appearance:textfield}.ogu-num::-webkit-inner-spin-button,.ogu-num::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.ogu-num:focus{border-color:#3b82f699}.ogu-unit{font-size:11px;font-weight:500;color:#e8e8e866}#ogu input[type=range],.ogu-range{width:100%;-webkit-appearance:none;-moz-appearance:none;appearance:none;height:2px;border-radius:2px;background:transparent;border:none;outline:none;padding:0;margin:4px 0;cursor:pointer;display:block}.ogu-range::-webkit-slider-runnable-track{height:2px;border-radius:2px;background:#fff3}.ogu-range::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#3b82f6;box-shadow:0 0 6px #3b82f699;cursor:pointer;margin-top:-7px;transition:background .15s,transform .1s}.ogu-range::-webkit-slider-thumb:hover{background:#60a5fa;transform:scale(1.1)}.ogu-range::-moz-range-track{height:2px;border-radius:2px;background:#fff3}.ogu-range::-moz-range-thumb{width:16px;height:16px;border:none;border-radius:50%;background:#3b82f6;cursor:pointer}.ogu-hr{height:1px;background:#ffffff12;border:none;margin:0}.ogu-btn-row{display:flex;gap:8px}.ogu-btn-row .ogu-btn{flex:1}.ogu-btn{width:100%;padding:8px 0;background:#3b82f626;border:1px solid rgba(59,130,246,.35);border-radius:9px;color:#60a5fa;font-family:Poppins,system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;transition:background .15s,border-color .15s}.ogu-btn:hover{background:#3b82f647;border-color:#3b82f699}.ogu-btn-rm{color:#f87171;background:#f8717112;border-color:#f8717140}.ogu-btn-rm:hover{background:#f8717126;border-color:#f8717180}.ogu-dbg{display:flex;flex-direction:column;gap:4px;padding:8px 10px;background:#0000004d;border:1px solid rgba(255,255,255,.06);border-radius:9px}.ogu-dbg-row{display:flex;justify-content:space-between;gap:8px;font-size:10px;line-height:1.6}.ogu-dbg-key{color:#e8e8e859;flex-shrink:0;font-weight:500}.ogu-dbg-val{color:#e8e8e8a6;text-align:right;word-break:break-all} ");

(function (require$$0, require$$0$1) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var createRoot;
  var m = require$$0$1;
  {
    createRoot = m.createRoot;
    m.hydrateRoot;
  }
  function createSignal(initial2) {
    let value = initial2;
    const listeners = /* @__PURE__ */ new Set();
    return {
      get() {
        return value;
      },
      set(next) {
        value = next;
        listeners.forEach((l2) => l2(next));
      },
      subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      }
    };
  }
  const initial = {
    roundKey: "—",
    coords: "—",
    circleStatus: "none",
    mapCount: 0,
    lastEvent: "—",
    rawRoundNum: "—",
    roundsLen: "—",
    lastApiUrl: "—"
  };
  const debugSignal = createSignal({ ...initial });
  function dbg(event, patch) {
    const next = { ...debugSignal.get(), lastEvent: event, ...patch };
    debugSignal.set(next);
    console.log(`[OGU] ${event}`, patch ?? "");
  }
  const GAME_RE = /\/api\/v[34]\/[\w-]+\/[\w-]+/;
  const GUESS_RE = /\/api\/v[34]\/(games|duels|live-challenges|team-duels|battle-royale)\/[\w-]+/;
  const win$5 = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  function logUrl(url) {
    if (/\/api\//.test(url)) {
      const path = url.replace(/^https?:\/\/[^/]+/, "").replace(/\?.*$/, "");
      dbg(`fetch: ${path}`, { lastApiUrl: path });
    }
  }
  function setupIntercepts(onData, onRoundPost) {
    const origFetch = win$5.fetch;
    win$5.fetch = async function(...args) {
      var _a;
      const url = typeof args[0] === "string" ? args[0] : ((_a = args[0]) == null ? void 0 : _a.url) ?? "";
      const method = (typeof args[1] === "object" && args[1] !== null ? args[1].method : void 0) ?? "GET";
      const res = await origFetch.apply(this, args);
      logUrl(url);
      if (/^(POST|PUT|PATCH)$/i.test(method) && GUESS_RE.test(url)) onRoundPost == null ? void 0 : onRoundPost();
      if (GAME_RE.test(url)) res.clone().json().then(onData).catch(() => {
      });
      return res;
    };
    const origOpen = win$5.XMLHttpRequest.prototype.open;
    const origSend = win$5.XMLHttpRequest.prototype.send;
    win$5.XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this._ogu_url = url;
      this._ogu_method = method;
      return origOpen.apply(this, [method, url, ...rest]);
    };
    win$5.XMLHttpRequest.prototype.send = function(...args) {
      const url = this._ogu_url ?? "";
      const method = this._ogu_method ?? "GET";
      logUrl(url);
      if (/^(POST|PUT|PATCH)$/i.test(method) && GUESS_RE.test(url)) onRoundPost == null ? void 0 : onRoundPost();
      if (url && GAME_RE.test(url)) {
        this.addEventListener("load", () => {
          try {
            onData(JSON.parse(this.responseText));
          } catch {
          }
        });
      }
      return origSend.apply(this, args);
    };
  }
  function checkNextData(onData) {
    var _a, _b, _c;
    try {
      const nextData = win$5.__NEXT_DATA__;
      if (!nextData) return;
      const pageProps = (_a = nextData == null ? void 0 : nextData.props) == null ? void 0 : _a.pageProps;
      if (!pageProps) return;
      for (const val of Object.values(pageProps)) {
        const candidate = val;
        if ((_b = candidate == null ? void 0 : candidate.rounds) == null ? void 0 : _b.length) {
          dbg("nextData → rounds found", { lastApiUrl: "__NEXT_DATA__" });
          onData(candidate);
          return;
        }
        if (val && typeof val === "object") {
          for (const inner of Object.values(val)) {
            const c = inner;
            if ((_c = c == null ? void 0 : c.rounds) == null ? void 0 : _c.length) {
              dbg("nextData → nested rounds found", { lastApiUrl: "__NEXT_DATA__" });
              onData(c);
              return;
            }
          }
        }
      }
    } catch {
    }
  }
  const win$4 = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  function hookMaps(onMap) {
    function tryHook() {
      var _a, _b;
      if (!((_b = (_a = win$4.google) == null ? void 0 : _a.maps) == null ? void 0 : _b.Map)) {
        setTimeout(tryHook, 150);
        return;
      }
      const seen = /* @__PURE__ */ new WeakSet();
      function dispatch(inst) {
        if (seen.has(inst)) return;
        seen.add(inst);
        setTimeout(() => onMap(inst), 300);
      }
      const OrigMap = win$4.google.maps.Map;
      win$4.google.maps.Map = new Proxy(OrigMap, {
        construct(Target, args, NewTarget) {
          const inst = Reflect.construct(Target, args, NewTarget);
          dispatch(inst);
          return inst;
        }
      });
      const origAddListener = win$4.google.maps.Map.prototype.addListener;
      win$4.google.maps.Map.prototype.addListener = function(...args) {
        dispatch(this);
        return origAddListener.apply(this, args);
      };
    }
    tryHook();
  }
  const win$3 = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  function hookStreetView(onCoords) {
    const resetFns = [];
    const redetectFns = [];
    function tryHook() {
      var _a, _b;
      if (!((_b = (_a = win$3.google) == null ? void 0 : _a.maps) == null ? void 0 : _b.StreetViewPanorama)) {
        setTimeout(tryHook, 150);
        return;
      }
      const seen = /* @__PURE__ */ new WeakSet();
      function attach(pano) {
        if (seen.has(pano)) return;
        seen.add(pano);
        let lastCapturedPanoId = null;
        let debounceTimer = null;
        function captureIfNew() {
          var _a2, _b2;
          const pos = (_a2 = pano.getPosition) == null ? void 0 : _a2.call(pano);
          if (!pos) return;
          const panoId = ((_b2 = pano.getPano) == null ? void 0 : _b2.call(pano)) || `${pos.lat().toFixed(5)},${pos.lng().toFixed(5)}`;
          if (panoId === lastCapturedPanoId) return;
          lastCapturedPanoId = panoId;
          onCoords({ lat: pos.lat(), lng: pos.lng() });
        }
        resetFns.push(() => {
          lastCapturedPanoId = null;
        });
        redetectFns.push(() => {
          lastCapturedPanoId = null;
          captureIfNew();
        });
        pano.addListener("pano_changed", () => {
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(captureIfNew, 300);
        });
        setTimeout(captureIfNew, 500);
      }
      const OrigPanorama = win$3.google.maps.StreetViewPanorama;
      win$3.google.maps.StreetViewPanorama = new Proxy(OrigPanorama, {
        construct(Target, args, NewTarget) {
          const inst = Reflect.construct(Target, args, NewTarget);
          setTimeout(() => attach(inst), 200);
          return inst;
        }
      });
      const origAddListener = win$3.google.maps.StreetViewPanorama.prototype.addListener;
      win$3.google.maps.StreetViewPanorama.prototype.addListener = function(...args) {
        attach(this);
        return origAddListener.apply(this, args);
      };
    }
    tryHook();
    return {
      reset: () => resetFns.forEach((fn) => fn()),
      redetect: () => redetectFns.forEach((fn) => fn())
    };
  }
  function watchURL(onReset) {
    const gameRe = /\/(game|challenge|duels|team-duels|live-challenge)\/([\w-]+)/;
    let prevId = (location.href.match(gameRe) ?? [])[2];
    new MutationObserver(() => {
      const id = (location.href.match(gameRe) ?? [])[2];
      if (id === prevId) return;
      prevId = id;
      onReset();
    }).observe(document, { subtree: true, childList: true });
  }
  const coordsSignal = createSignal(null);
  const roundKeySignal = createSignal(null);
  const GUESS_KEYS = ["guess-map", "game-layout__guess", "guess_map"];
  function findGuessMap(maps) {
    var _a, _b;
    const visible = (m2) => {
      var _a2, _b2;
      return !!((_b2 = (_a2 = m2.getDiv) == null ? void 0 : _a2.call(m2)) == null ? void 0 : _b2.offsetParent);
    };
    for (const m2 of [...maps].reverse()) {
      const div = (_a = m2.getDiv) == null ? void 0 : _a.call(m2);
      if (!(div == null ? void 0 : div.offsetParent)) continue;
      let el = div;
      while (el && el !== document.documentElement) {
        const cls = typeof el.className === "string" ? el.className : "";
        if (GUESS_KEYS.some((k2) => cls.includes(k2))) return m2;
        if (((_b = el.dataset) == null ? void 0 : _b.qa) === "guess-map") return m2;
        el = el.parentElement;
      }
    }
    return [...maps].reverse().find(visible) ?? null;
  }
  const win$2 = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  class CircleManager {
    constructor() {
      __publicField(this, "maps", []);
      __publicField(this, "circle", null);
      __publicField(this, "coords", null);
      __publicField(this, "cfg", null);
      __publicField(this, "needsRedraw", false);
      __publicField(this, "fallbackTimer", null);
    }
    setCfg(cfg) {
      this.cfg = cfg;
    }
    setCoords(coords) {
      this.coords = coords;
      dbg("setCoords", { coords: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` });
      if (this.needsRedraw) {
        dbg("setCoords → needsRedraw, triggering tryDraw");
        this.tryDraw();
      } else {
        this.tryDrawIfNeeded();
      }
    }
    addMap(map) {
      this.maps.push(map);
      dbg(`addMap (total: ${this.maps.length}, needsRedraw: ${this.needsRedraw})`, {
        mapCount: this.maps.length
      });
      if (this.needsRedraw) {
        this.tryDraw();
      } else {
        this.tryDrawIfNeeded();
      }
    }
    onNewRound() {
      dbg("onNewRound → drop", { circleStatus: "dropping" });
      this.drop();
      this.coords = null;
      this.cancelTimer();
      this.needsRedraw = true;
      this.fallbackTimer = setTimeout(() => {
        if (this.needsRedraw) {
          dbg("onNewRound fallback timer → tryDraw");
          this.tryDraw();
        }
      }, 1500);
    }
    cancelTimer() {
      if (this.fallbackTimer !== null) {
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = null;
      }
    }
    tryDrawIfNeeded() {
      var _a, _b;
      dbg(`tryDrawIfNeeded (circle: ${!!this.circle}, enabled: ${(_a = this.cfg) == null ? void 0 : _a.enabled}, coords: ${!!this.coords})`);
      if (!this.circle && ((_b = this.cfg) == null ? void 0 : _b.enabled) && this.coords) {
        this.tryDraw();
      }
    }
    applyAndDraw() {
      if (this.coords) {
        this.drop();
        this.tryDraw();
      }
    }
    drop() {
      if (this.circle) {
        dbg("drop → setMap(null)", { circleStatus: "none" });
        this.circle.setMap(null);
        this.circle = null;
      }
    }
    reset() {
      dbg("reset (game/URL change)");
      this.cancelTimer();
      this.needsRedraw = false;
      this.drop();
      this.maps = [];
      this.coords = null;
    }
    findGuessMap() {
      return findGuessMap(this.maps);
    }
    offsetCenter(coords, radiusKm) {
      const angle = Math.random() * 2 * Math.PI;
      const dist = radiusKm * (0.35 + Math.random() * 0.45);
      const deltaLat = dist * Math.sin(angle) / 111;
      const deltaLng = dist * Math.cos(angle) / (111 * Math.cos(coords.lat * Math.PI / 180));
      return { lat: coords.lat + deltaLat, lng: coords.lng + deltaLng };
    }
    tryDraw() {
      var _a, _b;
      if (!((_a = this.cfg) == null ? void 0 : _a.enabled) || !this.coords) {
        dbg(`tryDraw → skipped (enabled: ${(_b = this.cfg) == null ? void 0 : _b.enabled}, coords: ${!!this.coords})`);
        return;
      }
      const map = this.findGuessMap();
      if (!map) {
        dbg(`tryDraw → no guess map found (total maps: ${this.maps.length})`);
        return;
      }
      this.drop();
      this.cancelTimer();
      this.needsRedraw = false;
      const center = this.offsetCenter(this.coords, this.cfg.radius);
      this.circle = new win$2.google.maps.Circle({
        map,
        center,
        radius: this.cfg.radius * 1e3,
        fillColor: "#ef4444",
        fillOpacity: 0.15,
        strokeColor: "#ef4444",
        strokeWeight: 2,
        clickable: false,
        zIndex: 1
      });
      dbg("tryDraw → circle drawn ✓", {
        circleStatus: `drawn @ ${this.coords.lat.toFixed(4)}, ${this.coords.lng.toFixed(4)}`
      });
    }
  }
  const circleManager = new CircleManager();
  const DEFAULTS$2 = { radius: 500 };
  const CFG_KEY$2 = "ogu_cfg";
  function loadCfg$2() {
    try {
      const saved = GM_getValue(CFG_KEY$2, null);
      if (!saved) return { ...DEFAULTS$2 };
      const parsed = JSON.parse(saved);
      return {
        radius: typeof parsed.radius === "number" ? parsed.radius : DEFAULTS$2.radius
      };
    } catch {
      return { ...DEFAULTS$2 };
    }
  }
  class CircleModule {
    constructor() {
      __publicField(this, "id", "circle");
      __publicField(this, "name", "Circle Creator");
      __publicField(this, "description", "Draw a radius hint circle on the guess map");
      __publicField(this, "enabled", false);
      __publicField(this, "SettingsComponent");
      __publicField(this, "cfg", loadCfg$2());
    }
    getCfg() {
      return this.cfg;
    }
    setCfg(patch) {
      this.cfg = { ...this.cfg, ...patch };
      GM_setValue(CFG_KEY$2, JSON.stringify(this.cfg));
      circleManager.setCfg({ ...this.cfg, enabled: this.enabled });
      if (this.enabled) circleManager.applyAndDraw();
    }
    init() {
      circleManager.setCfg({ ...this.cfg, enabled: false });
    }
    enable() {
      this.enabled = true;
      circleManager.setCfg({ ...this.cfg, enabled: true });
      circleManager.tryDrawIfNeeded();
    }
    disable() {
      this.enabled = false;
      circleManager.setCfg({ ...this.cfg, enabled: false });
      circleManager.drop();
    }
    onCoords(coords) {
      circleManager.setCoords(coords);
    }
    onNewRound() {
      circleManager.onNewRound();
    }
    onMapAdded(map) {
      circleManager.addMap(map);
    }
    onReset() {
      circleManager.reset();
    }
    applyAndDraw() {
      circleManager.applyAndDraw();
    }
    drop() {
      circleManager.drop();
    }
  }
  const circleModule = new CircleModule();
  function CircleSettings() {
    const [cfg, setCfg] = require$$0.useState(() => circleModule.getCfg());
    const [radiusDraft, setRadiusDraft] = require$$0.useState(String(cfg.radius));
    function commitRadius(raw) {
      const v = Math.max(10, Math.min(3e3, parseInt(raw, 10) || cfg.radius));
      setRadiusDraft(String(v));
      circleModule.setCfg({ radius: v });
      setCfg(circleModule.getCfg());
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-radius", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-lbl", children: "Radius" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                className: "ogu-num",
                value: radiusDraft,
                min: 10,
                max: 3e3,
                step: 10,
                onChange: (e) => setRadiusDraft(e.target.value),
                onBlur: (e) => commitRadius(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") commitRadius(radiusDraft);
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-unit", children: "km" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "range",
            className: "ogu-range",
            value: cfg.radius,
            min: 10,
            max: 3e3,
            step: 10,
            onChange: (e) => {
              const v = Number(e.target.value);
              setRadiusDraft(String(v));
              circleModule.setCfg({ radius: v });
              setCfg(circleModule.getCfg());
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-btn-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ogu-btn", onClick: () => circleModule.applyAndDraw(), children: "Apply & Draw" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ogu-btn ogu-btn-rm", onClick: () => circleModule.drop(), children: "Remove" })
      ] })
    ] });
  }
  const win$1 = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  class LinesManager {
    constructor() {
      __publicField(this, "maps", []);
      __publicField(this, "latLine", null);
      __publicField(this, "lngLine", null);
      __publicField(this, "coords", null);
      __publicField(this, "cfg", null);
      __publicField(this, "needsRedraw", false);
      __publicField(this, "fallbackTimer", null);
    }
    setCfg(cfg) {
      this.cfg = cfg;
    }
    setCoords(coords) {
      this.coords = coords;
      if (this.needsRedraw) this.tryDraw();
      else this.tryDrawIfNeeded();
    }
    addMap(map) {
      this.maps.push(map);
      if (this.needsRedraw) this.tryDraw();
      else this.tryDrawIfNeeded();
    }
    onNewRound() {
      this.drop();
      this.coords = null;
      this.cancelTimer();
      this.needsRedraw = true;
      this.fallbackTimer = setTimeout(() => {
        if (this.needsRedraw) this.tryDraw();
      }, 1500);
    }
    tryDrawIfNeeded() {
      var _a;
      if (!this.hasAnyLine() && ((_a = this.cfg) == null ? void 0 : _a.enabled) && this.coords) {
        this.tryDraw();
      }
    }
    applyAndDraw() {
      if (this.coords) {
        this.drop();
        this.tryDraw();
      }
    }
    drop() {
      var _a, _b;
      (_a = this.latLine) == null ? void 0 : _a.setMap(null);
      this.latLine = null;
      (_b = this.lngLine) == null ? void 0 : _b.setMap(null);
      this.lngLine = null;
    }
    reset() {
      this.cancelTimer();
      this.needsRedraw = false;
      this.drop();
      this.maps = [];
      this.coords = null;
    }
    hasAnyLine() {
      return this.latLine !== null || this.lngLine !== null;
    }
    cancelTimer() {
      if (this.fallbackTimer !== null) {
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = null;
      }
    }
    tryDraw() {
      var _a;
      if (!((_a = this.cfg) == null ? void 0 : _a.enabled) || !this.coords) return;
      const map = findGuessMap(this.maps);
      if (!map) return;
      this.drop();
      this.cancelTimer();
      this.needsRedraw = false;
      const { lat, lng } = this.coords;
      if (this.cfg.showLat) {
        const latPath = [];
        for (let l2 = -180; l2 <= 180; l2 += 5) latPath.push({ lat, lng: l2 });
        this.latLine = new win$1.google.maps.Polyline({
          map,
          path: latPath,
          geodesic: false,
          strokeColor: "#ef4444",
          strokeWeight: 2,
          strokeOpacity: 0.85,
          clickable: false,
          zIndex: 2
        });
      }
      if (this.cfg.showLng) {
        this.lngLine = new win$1.google.maps.Polyline({
          map,
          path: [{ lat: -85, lng }, { lat: 85, lng }],
          strokeColor: "#3b82f6",
          strokeWeight: 2,
          strokeOpacity: 0.85,
          clickable: false,
          zIndex: 2
        });
      }
    }
  }
  const linesManager = new LinesManager();
  const DEFAULTS$1 = { showLat: true, showLng: true };
  const CFG_KEY$1 = "ogu_lines_cfg";
  function loadCfg$1() {
    try {
      const saved = GM_getValue(CFG_KEY$1, null);
      if (!saved) return { ...DEFAULTS$1 };
      const parsed = JSON.parse(saved);
      return {
        showLat: typeof parsed.showLat === "boolean" ? parsed.showLat : DEFAULTS$1.showLat,
        showLng: typeof parsed.showLng === "boolean" ? parsed.showLng : DEFAULTS$1.showLng
      };
    } catch {
      return { ...DEFAULTS$1 };
    }
  }
  class LinesModule {
    constructor() {
      __publicField(this, "id", "lines");
      __publicField(this, "name", "Lines");
      __publicField(this, "description", "Draw lat / lng lines through the real location");
      __publicField(this, "enabled", false);
      __publicField(this, "SettingsComponent");
      __publicField(this, "cfg", loadCfg$1());
    }
    getCfg() {
      return this.cfg;
    }
    setCfg(patch) {
      this.cfg = { ...this.cfg, ...patch };
      GM_setValue(CFG_KEY$1, JSON.stringify(this.cfg));
      linesManager.setCfg({ ...this.cfg, enabled: this.enabled });
      if (this.enabled) linesManager.applyAndDraw();
    }
    init() {
      linesManager.setCfg({ ...this.cfg, enabled: false });
    }
    enable() {
      this.enabled = true;
      linesManager.setCfg({ ...this.cfg, enabled: true });
      linesManager.tryDrawIfNeeded();
    }
    disable() {
      this.enabled = false;
      linesManager.setCfg({ ...this.cfg, enabled: false });
      linesManager.drop();
    }
    onCoords(coords) {
      linesManager.setCoords(coords);
    }
    onNewRound() {
      linesManager.onNewRound();
    }
    onMapAdded(map) {
      linesManager.addMap(map);
    }
    onReset() {
      linesManager.reset();
    }
  }
  const linesModule = new LinesModule();
  function Toggle({ checked, onChange }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "ogu-sw", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "checkbox",
          checked,
          onChange: (e) => onChange(e.target.checked)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-sw-track" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-sw-thumb" })
    ] });
  }
  function LinesSettings() {
    const [cfg, setCfg] = require$$0.useState(() => linesModule.getCfg());
    function update(patch) {
      linesModule.setCfg(patch);
      setCfg(linesModule.getCfg());
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-lines-opts", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-line-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-line-dot", style: { background: "#ef4444" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-lbl", children: "Latitude line" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { checked: cfg.showLat, onChange: (v) => update({ showLat: v }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-line-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-line-dot", style: { background: "#3b82f6" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-lbl", children: "Longitude line" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { checked: cfg.showLng, onChange: (v) => update({ showLng: v }) })
      ] })
    ] });
  }
  const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  class BandsManager {
    constructor() {
      __publicField(this, "maps", []);
      __publicField(this, "latBand", null);
      __publicField(this, "lngBand", null);
      __publicField(this, "coords", null);
      __publicField(this, "cfg", null);
      __publicField(this, "needsRedraw", false);
      __publicField(this, "fallbackTimer", null);
    }
    setCfg(cfg) {
      this.cfg = cfg;
    }
    setCoords(coords) {
      this.coords = coords;
      if (this.needsRedraw) this.tryDraw();
      else this.tryDrawIfNeeded();
    }
    addMap(map) {
      this.maps.push(map);
      if (this.needsRedraw) this.tryDraw();
      else this.tryDrawIfNeeded();
    }
    onNewRound() {
      this.drop();
      this.coords = null;
      this.cancelTimer();
      this.needsRedraw = true;
      this.fallbackTimer = setTimeout(() => {
        if (this.needsRedraw) this.tryDraw();
      }, 1500);
    }
    tryDrawIfNeeded() {
      var _a;
      if (!this.hasAnyBand() && ((_a = this.cfg) == null ? void 0 : _a.enabled) && this.coords) {
        this.tryDraw();
      }
    }
    applyAndDraw() {
      if (this.coords) {
        this.drop();
        this.tryDraw();
      }
    }
    drop() {
      var _a, _b;
      (_a = this.latBand) == null ? void 0 : _a.setMap(null);
      this.latBand = null;
      (_b = this.lngBand) == null ? void 0 : _b.setMap(null);
      this.lngBand = null;
    }
    reset() {
      this.cancelTimer();
      this.needsRedraw = false;
      this.drop();
      this.maps = [];
      this.coords = null;
    }
    hasAnyBand() {
      return this.latBand !== null || this.lngBand !== null;
    }
    cancelTimer() {
      if (this.fallbackTimer !== null) {
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = null;
      }
    }
    tryDraw() {
      var _a;
      if (!((_a = this.cfg) == null ? void 0 : _a.enabled) || !this.coords) return;
      const map = findGuessMap(this.maps);
      if (!map) return;
      this.drop();
      this.cancelTimer();
      this.needsRedraw = false;
      const { lat, lng } = this.coords;
      const halfLat = this.cfg.latWidthKm / 2;
      const halfLng = this.cfg.lngWidthKm / 2;
      const deltaLat = halfLat / 111;
      const deltaLng = halfLng / (111 * Math.cos(lat * Math.PI / 180));
      const latOffset = (Math.random() * 2 - 1) * deltaLat * 0.8;
      const lngOffset = (Math.random() * 2 - 1) * deltaLng * 0.8;
      const centerLat = lat + latOffset;
      const centerLng = lng + lngOffset;
      const base = {
        map,
        strokeWeight: 1.5,
        strokeOpacity: 0.45,
        clickable: false,
        zIndex: 1
      };
      if (this.cfg.showLat) {
        this.latBand = new win.google.maps.Rectangle({
          ...base,
          bounds: {
            north: Math.min(90, centerLat + deltaLat),
            south: Math.max(-90, centerLat - deltaLat),
            east: 179.9999,
            west: -179.9999
          },
          strokeColor: "#ef4444",
          fillColor: "#ef4444",
          fillOpacity: 0.32
        });
      }
      if (this.cfg.showLng) {
        this.lngBand = new win.google.maps.Rectangle({
          ...base,
          bounds: {
            north: 85,
            south: -85,
            east: Math.min(180, centerLng + deltaLng),
            west: Math.max(-180, centerLng - deltaLng)
          },
          strokeColor: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.32
        });
      }
    }
  }
  const bandsManager = new BandsManager();
  const DEFAULTS = { latWidthKm: 100, lngWidthKm: 100, showLat: true, showLng: true };
  const CFG_KEY = "ogu_bands_cfg";
  function loadCfg() {
    try {
      const saved = GM_getValue(CFG_KEY, null);
      if (!saved) return { ...DEFAULTS };
      const p2 = JSON.parse(saved);
      return {
        latWidthKm: typeof p2.latWidthKm === "number" ? p2.latWidthKm : DEFAULTS.latWidthKm,
        lngWidthKm: typeof p2.lngWidthKm === "number" ? p2.lngWidthKm : DEFAULTS.lngWidthKm,
        showLat: typeof p2.showLat === "boolean" ? p2.showLat : DEFAULTS.showLat,
        showLng: typeof p2.showLng === "boolean" ? p2.showLng : DEFAULTS.showLng
      };
    } catch {
      return { ...DEFAULTS };
    }
  }
  class BandsModule {
    constructor() {
      __publicField(this, "id", "bands");
      __publicField(this, "name", "Bands");
      __publicField(this, "description", "Draw lat / lng rectangular bands through the real location");
      __publicField(this, "enabled", false);
      __publicField(this, "SettingsComponent");
      __publicField(this, "cfg", loadCfg());
    }
    getCfg() {
      return this.cfg;
    }
    sync(enabled) {
      bandsManager.setCfg({ ...this.cfg, enabled });
    }
    setCfg(patch) {
      this.cfg = { ...this.cfg, ...patch };
      GM_setValue(CFG_KEY, JSON.stringify(this.cfg));
      this.sync(this.enabled);
      if (this.enabled) bandsManager.applyAndDraw();
    }
    init() {
      this.sync(false);
    }
    enable() {
      this.enabled = true;
      this.sync(true);
      bandsManager.tryDrawIfNeeded();
    }
    disable() {
      this.enabled = false;
      this.sync(false);
      bandsManager.drop();
    }
    onCoords(coords) {
      bandsManager.setCoords(coords);
    }
    onNewRound() {
      bandsManager.onNewRound();
    }
    onMapAdded(map) {
      bandsManager.addMap(map);
    }
    onReset() {
      bandsManager.reset();
    }
  }
  const bandsModule = new BandsModule();
  function BandsSettings() {
    const [cfg, setCfg] = require$$0.useState(() => bandsModule.getCfg());
    const [latDraft, setLatDraft] = require$$0.useState(String(cfg.latWidthKm));
    const [lngDraft, setLngDraft] = require$$0.useState(String(cfg.lngWidthKm));
    function update(patch) {
      bandsModule.setCfg(patch);
      setCfg(bandsModule.getCfg());
    }
    function commitLat(raw) {
      const v = Math.max(10, Math.min(1e3, parseInt(raw, 10) || cfg.latWidthKm));
      setLatDraft(String(v));
      update({ latWidthKm: v });
    }
    function commitLng(raw) {
      const v = Math.max(10, Math.min(1e3, parseInt(raw, 10) || cfg.lngWidthKm));
      setLngDraft(String(v));
      update({ lngWidthKm: v });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-lines-opts", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-line-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-line-dot", style: { background: "#ef4444" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-lbl", children: "Latitude band" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { checked: cfg.showLat, onChange: (v) => update({ showLat: v }) })
      ] }),
      cfg.showLat && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-band-slider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "range",
            className: "ogu-range",
            value: cfg.latWidthKm,
            min: 10,
            max: 1e3,
            step: 10,
            onChange: (e) => {
              const v = Number(e.target.value);
              setLatDraft(String(v));
              update({ latWidthKm: v });
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-band-val", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              className: "ogu-num",
              value: latDraft,
              min: 10,
              max: 1e3,
              step: 10,
              onChange: (e) => setLatDraft(e.target.value),
              onBlur: (e) => commitLat(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") commitLat(latDraft);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-unit", children: "km" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-line-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-line-dot", style: { background: "#3b82f6" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-lbl", children: "Longitude band" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { checked: cfg.showLng, onChange: (v) => update({ showLng: v }) })
      ] }),
      cfg.showLng && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-band-slider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "range",
            className: "ogu-range",
            value: cfg.lngWidthKm,
            min: 10,
            max: 1e3,
            step: 10,
            onChange: (e) => {
              const v = Number(e.target.value);
              setLngDraft(String(v));
              update({ lngWidthKm: v });
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-band-val", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              className: "ogu-num",
              value: lngDraft,
              min: 10,
              max: 1e3,
              step: 10,
              onChange: (e) => setLngDraft(e.target.value),
              onBlur: (e) => commitLng(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") commitLng(lngDraft);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-unit", children: "km" })
        ] })
      ] })
    ] });
  }
  const STYLE_ID = "ogu-sv-hider";
  const CSS = `
  [data-qa="panorama"],
  .panorama,
  .game-layout__panorama,
  .game-layout__panorama-container {
    visibility: hidden !important;
  }
`;
  class StreetViewHiderModule {
    constructor() {
      __publicField(this, "id", "streetViewHider");
      __publicField(this, "name", "Street View Hider");
      __publicField(this, "description", "Hide the panorama so you cannot see the location");
      __publicField(this, "enabled", false);
    }
    init() {
    }
    enable() {
      this.enabled = true;
      if (document.getElementById(STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    disable() {
      var _a;
      this.enabled = false;
      (_a = document.getElementById(STYLE_ID)) == null ? void 0 : _a.remove();
    }
  }
  const streetViewHiderModule = new StreetViewHiderModule();
  const ENABLED_KEY = "ogu_modules_enabled";
  class ModuleRegistry {
    constructor() {
      __publicField(this, "modules", []);
    }
    register(module) {
      this.modules.push(module);
    }
    getAll() {
      return this.modules;
    }
    initAll() {
      const saved = this.loadEnabledStates();
      for (const m2 of this.modules) {
        m2.init();
        const shouldEnable = saved[m2.id] ?? m2.enabled;
        if (shouldEnable) m2.enable();
        else m2.disable();
      }
    }
    setEnabled(id, enabled) {
      const m2 = this.modules.find((x) => x.id === id);
      if (!m2) return;
      if (enabled) m2.enable();
      else m2.disable();
      this.saveEnabledStates();
    }
    dispatchCoords(coords) {
      this.modules.forEach((m2) => {
        var _a;
        return (_a = m2.onCoords) == null ? void 0 : _a.call(m2, coords);
      });
    }
    dispatchNewRound() {
      this.modules.forEach((m2) => {
        var _a;
        return (_a = m2.onNewRound) == null ? void 0 : _a.call(m2);
      });
    }
    dispatchMapAdded(map) {
      this.modules.forEach((m2) => {
        var _a;
        return (_a = m2.onMapAdded) == null ? void 0 : _a.call(m2, map);
      });
    }
    dispatchReset() {
      this.modules.forEach((m2) => {
        var _a;
        return (_a = m2.onReset) == null ? void 0 : _a.call(m2);
      });
    }
    saveEnabledStates() {
      const state = {};
      for (const m2 of this.modules) state[m2.id] = m2.enabled;
      GM_setValue(ENABLED_KEY, JSON.stringify(state));
    }
    loadEnabledStates() {
      try {
        const saved = GM_getValue(ENABLED_KEY, null);
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
  }
  const registry = new ModuleRegistry();
  circleModule.SettingsComponent = CircleSettings;
  linesModule.SettingsComponent = LinesSettings;
  bandsModule.SettingsComponent = BandsSettings;
  registry.register(circleModule);
  registry.register(linesModule);
  registry.register(bandsModule);
  registry.register(streetViewHiderModule);
  function App({ onRefresh }) {
    const modules = registry.getAll();
    const [enabledMap, setEnabledMap] = require$$0.useState(
      () => Object.fromEntries(modules.map((m2) => [m2.id, m2.enabled]))
    );
    const [collapsed, setCollapsed] = require$$0.useState(false);
    const [debug, setDebug] = require$$0.useState(false);
    const [dbgState, setDbgState] = require$$0.useState(debugSignal.get());
    const [visible, setVisible] = require$$0.useState(true);
    const [pos, setPos] = require$$0.useState({ x: 0, y: 0 });
    const dragging = require$$0.useRef(false);
    const dragStart = require$$0.useRef({ mx: 0, my: 0, px: 0, py: 0 });
    require$$0.useEffect(() => debugSignal.subscribe(setDbgState), []);
    require$$0.useEffect(() => {
      const onKey = (e) => {
        var _a;
        if (e.code === "KeyO" && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const tag = (_a = e.target) == null ? void 0 : _a.tagName;
          if (tag === "INPUT" || tag === "TEXTAREA") return;
          setVisible((v) => !v);
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);
    require$$0.useEffect(() => {
      const onMove = (e) => {
        if (!dragging.current) return;
        setPos({
          x: dragStart.current.px + e.clientX - dragStart.current.mx,
          y: dragStart.current.py + e.clientY - dragStart.current.my
        });
      };
      const onUp = () => {
        dragging.current = false;
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
    }, []);
    function onDragStart(e) {
      dragging.current = true;
      dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    }
    function toggleModule(id, enabled) {
      registry.setEnabled(id, enabled);
      setEnabledMap((prev) => ({ ...prev, [id]: enabled }));
    }
    if (!visible) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "ogu", style: { transform: `translate(${pos.x}px, ${pos.y}px)` }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-hdr", onMouseDown: onDragStart, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-ttl", children: "Okancore Utils" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "2px" }, onMouseDown: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ogu-tog", title: "Re-detect hints", onClick: onRefresh, children: "↺" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ogu-tog", onClick: () => setCollapsed((c) => !c), children: collapsed ? "+" : "−" })
        ] })
      ] }),
      !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-body", children: [
        modules.map((m2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "ogu-hr" }, `hr-${m2.id}`),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ModuleCard,
            {
              module: m2,
              enabled: enabledMap[m2.id] ?? false,
              onToggle: (v) => toggleModule(m2.id, v)
            },
            m2.id
          )
        ] })),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "ogu-hr" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-lbl", children: "Debug" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { checked: debug, onChange: setDebug })
        ] }),
        debug && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-dbg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DbgRow, { label: "Last event", value: dbgState.lastEvent }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DbgRow, { label: "Round key", value: dbgState.roundKey }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DbgRow, { label: "Coords", value: dbgState.coords }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DbgRow, { label: "Maps", value: String(dbgState.mapCount) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DbgRow, { label: "Circle", value: dbgState.circleStatus }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DbgRow, { label: "API roundNum", value: dbgState.rawRoundNum }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DbgRow, { label: "API rounds[]", value: dbgState.roundsLen }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DbgRow, { label: "Last API URL", value: dbgState.lastApiUrl })
        ] })
      ] })
    ] });
  }
  function ModuleCard({
    module: m2,
    enabled,
    onToggle
  }) {
    const Settings = m2.SettingsComponent;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-module", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-module-hdr", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-module-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-module-name", children: m2.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-module-desc", children: m2.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { checked: enabled, onChange: onToggle })
      ] }),
      enabled && Settings && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ogu-module-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, {}) })
    ] });
  }
  function DbgRow({ label, value }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ogu-dbg-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-dbg-key", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ogu-dbg-val", children: value })
    ] });
  }
  registry.initAll();
  function handleGameData(data) {
    var _a, _b, _c;
    if (!((_a = data == null ? void 0 : data.rounds) == null ? void 0 : _a.length)) return;
    const n2 = data.currentRoundNumber ?? data.rounds.length;
    const key = `${data.token ?? data.id}:${n2}`;
    const isNew = key !== roundKeySignal.get();
    dbg(`intercept → roundNum:${n2} key:${key} isNew:${isNew} rounds:${data.rounds.length}`, {
      rawRoundNum: String(data.currentRoundNumber ?? "undefined"),
      roundsLen: String(data.rounds.length)
    });
    if (isNew) {
      roundKeySignal.set(key);
      dbg(`new round → ${key}`, { roundKey: key });
      registry.dispatchNewRound();
      coordsSignal.set(null);
    }
    const round = data.rounds[n2 - 1];
    const lat = (round == null ? void 0 : round.lat) ?? ((_b = round == null ? void 0 : round.panorama) == null ? void 0 : _b.lat);
    const lng = (round == null ? void 0 : round.lng) ?? ((_c = round == null ? void 0 : round.panorama) == null ? void 0 : _c.lng);
    if (!round || lat == null || lng == null) {
      dbg(`intercept → no coords for round ${n2} (rounds.length=${data.rounds.length})`);
      return;
    }
    coordsSignal.set({ lat, lng });
    registry.dispatchCoords({ lat, lng });
  }
  setupIntercepts(handleGameData, () => {
    dbg("POST → round transition, clearing state");
    registry.dispatchNewRound();
    coordsSignal.set(null);
    roundKeySignal.set(null);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => checkNextData(handleGameData));
  } else {
    checkNextData(handleGameData);
  }
  hookMaps((map) => registry.dispatchMapAdded(map));
  function distKm(a, b) {
    const R = 6371;
    const dLat = (b.lat - a.lat) * (Math.PI / 180);
    const dLng = (b.lng - a.lng) * (Math.PI / 180);
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * (Math.PI / 180)) * Math.cos(b.lat * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(s));
  }
  const svHook = hookStreetView((coords) => {
    const current = coordsSignal.get();
    if (current && distKm(current, coords) < 20) return;
    if (current) {
      dbg("streetView → >20km shift → new round");
      registry.dispatchNewRound();
      coordsSignal.set(null);
      roundKeySignal.set(null);
    }
    dbg("streetView → coords", { coords: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` });
    coordsSignal.set(coords);
    registry.dispatchCoords(coords);
  });
  watchURL(() => {
    registry.dispatchReset();
    coordsSignal.set(null);
    roundKeySignal.set(null);
    svHook.reset();
  });
  function forceRefresh() {
    dbg("manual refresh");
    registry.dispatchNewRound();
    coordsSignal.set(null);
    roundKeySignal.set(null);
    svHook.redetect();
  }
  function injectFont() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }
  function mount() {
    if (document.getElementById("ogu-root")) return;
    injectFont();
    const root = document.createElement("div");
    root.id = "ogu-root";
    document.body.appendChild(root);
    createRoot(root).render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, { onRefresh: forceRefresh }));
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

})(React, ReactDOM);