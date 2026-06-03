import { useEffect, useRef, useState } from 'react';
import { useConfig } from './hooks/useConfig';
import { circleManager } from './lib/circleManager';
import { debugSignal, type DebugState } from './lib/debugStore';
import Toggle from './components/Toggle';
import './App.css';

export default function App() {
  const [cfg, update] = useConfig();
  const [collapsed, setCollapsed] = useState(false);
  const [radiusDraft, setRadiusDraft] = useState(String(cfg.radius));
  const [debug, setDebug] = useState(false);
  const [dbgState, setDbgState] = useState<DebugState>(debugSignal.get());
  const [visible, setVisible] = useState(true);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  useEffect(() => {
    circleManager.setCfg(cfg);
  }, [cfg]);

  useEffect(() => {
    circleManager.tryDrawIfNeeded();
    return debugSignal.subscribe(setDbgState);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyO' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        setVisible(v => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: dragStart.current.px + e.clientX - dragStart.current.mx,
        y: dragStart.current.py + e.clientY - dragStart.current.my,
      });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  function onDragStart(e: React.MouseEvent) {
    dragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
  }

  function commitRadius() {
    const v = Math.max(10, Math.min(20000, parseInt(radiusDraft, 10) || cfg.radius));
    setRadiusDraft(String(v));
    update({ radius: v });
  }

  if (!visible) return null;

  return (
    <div id="ogu" style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
      <div className="ogu-hdr" onMouseDown={onDragStart}>
        <span className="ogu-ttl">◎ Okancore GeoGuessr Utils</span>
        <button
          className="ogu-tog"
          onMouseDown={e => e.stopPropagation()}
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '+' : '−'}
        </button>
      </div>

      {!collapsed && (
        <div className="ogu-body">
          <Row label="Enabled">
            <Toggle
              checked={cfg.enabled}
              onChange={v => {
                update({ enabled: v });
                if (v) circleManager.applyAndDraw();
                else circleManager.drop();
              }}
            />
          </Row>

          <Row label="Multi-round">
            <Toggle
              checked={cfg.multiRound}
              onChange={v => update({ multiRound: v })}
            />
          </Row>

          <hr className="ogu-hr" />

          <Row label="Radius">
            <div className="ogu-field">
              <input
                type="number"
                className="ogu-num"
                value={radiusDraft}
                min={10}
                max={20000}
                step={10}
                onChange={e => setRadiusDraft(e.target.value)}
                onBlur={commitRadius}
                onKeyDown={e => { if (e.key === 'Enter') commitRadius(); }}
              />
              <span className="ogu-unit">km</span>
            </div>
          </Row>

          <Row label="Color">
            <input
              type="color"
              className="ogu-color"
              value={cfg.circleColor}
              onChange={e => update({ circleColor: e.target.value, strokeColor: e.target.value })}
            />
          </Row>

          <hr className="ogu-hr" />

          <button className="ogu-btn" onClick={() => circleManager.applyAndDraw()}>
            Apply &amp; Draw
          </button>
          <button className="ogu-btn ogu-btn-rm" onClick={() => circleManager.drop()}>
            Remove Circle
          </button>

          <hr className="ogu-hr" />

          <Row label="Debug">
            <Toggle checked={debug} onChange={setDebug} />
          </Row>

          {debug && (
            <div className="ogu-dbg">
              <DbgRow label="Last event"  value={dbgState.lastEvent} />
              <DbgRow label="Round key"   value={dbgState.roundKey} />
              <DbgRow label="Coords"      value={dbgState.coords} />
              <DbgRow label="Maps"        value={String(dbgState.mapCount)} />
              <DbgRow label="Circle"      value={dbgState.circleStatus} />
              <DbgRow label="API roundNum" value={dbgState.rawRoundNum} />
              <DbgRow label="API rounds[]" value={dbgState.roundsLen} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="ogu-row">
      <span className="ogu-lbl">{label}</span>
      {children}
    </div>
  );
}

function DbgRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="ogu-dbg-row">
      <span className="ogu-dbg-key">{label}</span>
      <span className="ogu-dbg-val">{value}</span>
    </div>
  );
}
