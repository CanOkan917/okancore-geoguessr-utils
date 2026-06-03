import { useEffect, useState } from 'react';
import { useConfig } from './hooks/useConfig';
import { circleManager } from './lib/circleManager';
import Toggle from './components/Toggle';
import './App.css';

export default function App() {
  const [cfg, update] = useConfig();
  const [collapsed, setCollapsed] = useState(false);
  const [radiusDraft, setRadiusDraft] = useState(String(cfg.radius));

  // Keep circleManager config in sync
  useEffect(() => {
    circleManager.setCfg(cfg);
  }, [cfg]);

  // Trigger initial draw attempt after mount (handles the case where
  // API response and map instance both arrived before React mounted)
  useEffect(() => {
    circleManager.tryDrawIfNeeded();
  }, []);

  function commitRadius() {
    const v = Math.max(10, Math.min(20000, parseInt(radiusDraft, 10) || cfg.radius));
    setRadiusDraft(String(v));
    update({ radius: v });
  }

  return (
    <div id="ogu">
      <div className="ogu-hdr">
        <span className="ogu-ttl">◎ Okancore GeoGuessr Utils</span>
        <button
          className="ogu-tog"
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
