import { useState, useRef, useEffect } from 'react';
import { registry } from './modules';
import type { Module } from './modules/types';
import Toggle from './components/Toggle';
import { debugSignal, type DebugState } from './lib/debugStore';
import './App.css';

export default function App() {
  const modules = registry.getAll();
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(modules.map(m => [m.id, m.enabled]))
  );
  const [collapsed, setCollapsed] = useState(false);
  const [debug, setDebug] = useState(false);
  const [dbgState, setDbgState] = useState<DebugState>(debugSignal.get());
  const [visible, setVisible] = useState(true);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  useEffect(() => debugSignal.subscribe(setDbgState), []);

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

  function toggleModule(id: string, enabled: boolean) {
    registry.setEnabled(id, enabled);
    setEnabledMap(prev => ({ ...prev, [id]: enabled }));
  }

  if (!visible) return null;

  return (
    <div id="ogu" style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
      <div className="ogu-hdr" onMouseDown={onDragStart}>
        <span className="ogu-ttl">Okancore Utils</span>
        <button
          className="ogu-tog"
          onMouseDown={e => e.stopPropagation()}
          onClick={() => setCollapsed(c => !c)}
        >
          {collapsed ? '+' : '−'}
        </button>
      </div>

      {!collapsed && (
        <div className="ogu-body">
          {modules.map((m, i) => (
            <>
              {i > 0 && <hr key={`hr-${m.id}`} className="ogu-hr" />}
              <ModuleCard
                key={m.id}
                module={m}
                enabled={enabledMap[m.id] ?? false}
                onToggle={v => toggleModule(m.id, v)}
              />
            </>
          ))}

          <hr className="ogu-hr" />

          <div className="ogu-row">
            <span className="ogu-lbl">Debug</span>
            <Toggle checked={debug} onChange={setDebug} />
          </div>

          {debug && (
            <div className="ogu-dbg">
              <DbgRow label="Last event"   value={dbgState.lastEvent} />
              <DbgRow label="Round key"    value={dbgState.roundKey} />
              <DbgRow label="Coords"       value={dbgState.coords} />
              <DbgRow label="Maps"         value={String(dbgState.mapCount)} />
              <DbgRow label="Circle"       value={dbgState.circleStatus} />
              <DbgRow label="API roundNum" value={dbgState.rawRoundNum} />
              <DbgRow label="API rounds[]" value={dbgState.roundsLen} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ModuleCard({
  module: m,
  enabled,
  onToggle,
}: {
  module: Module;
  enabled: boolean;
  onToggle: (v: boolean) => void;
}) {
  const Settings = m.SettingsComponent;
  return (
    <div className="ogu-module">
      <div className="ogu-module-hdr">
        <div className="ogu-module-info">
          <span className="ogu-module-name">{m.name}</span>
          <span className="ogu-module-desc">{m.description}</span>
        </div>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>
      {enabled && Settings && (
        <div className="ogu-module-body">
          <Settings />
        </div>
      )}
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
